import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from Backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// --- Configuration & CLI Arguments ---
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const DROP_TARGET = args.includes('--drop-target');
const SKIP_SEED = args.includes('--skip-seed');
const TARGET_COLLECTION = args.find(arg => arg.startsWith('--collection='))?.split('=')[1];
const BATCH_SIZE = 1000;

const SOURCE_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school-management';
const TARGET_URI = process.env.NEW_MONGO_URI || 'mongodb://127.0.0.1:27017/school-management-new';

const EXCLUDED_COLLECTIONS = ['logs', 'sessions', 'system.indexes', 'migration_logs'];
const LOG_FILE = path.join(__dirname, 'migration.log');

// --- Helper: Persistent Logging ---
function logToFile(message) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(LOG_FILE, formattedMessage);
}

/**
 * Data Transformation & Validation
 */
function transformAndValidate(collectionName, doc) {
    const newDoc = { ...doc };

    // 1. Validation Logic
    if (collectionName === 'users' && !newDoc.email) {
        throw new Error(`Validation Failed: User ${newDoc._id} is missing an email.`);
    }

    // 2. Transformation Logic
    newDoc.migrated = true;
    newDoc.migration_version = 'v1.1'; // Professional Versioning

    if (collectionName === 'users' && !newDoc.status) {
        newDoc.status = 'active';
    }

    if (collectionName === 'students' && !newDoc.academicYear) {
        newDoc.academicYear = '2025-2026';
    }

    // Ensure dates
    if (!newDoc.createdAt) newDoc.createdAt = new Date();
    if (!newDoc.updatedAt) newDoc.updatedAt = new Date();

    return newDoc;
}

async function copyDatabase() {
    logToFile('🚀 Starting Production-Grade Migration (v1.1)');
    if (DRY_RUN) logToFile('⚠️ DRY RUN MODE ENABLED (No data will be written)');

    logToFile(`Source: ${SOURCE_URI}`);
    logToFile(`Target: ${TARGET_URI}\n`);

    let sourceConn, targetConn;

    try {
        sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
        targetConn = await mongoose.createConnection(TARGET_URI).asPromise();

        const sourceDb = sourceConn.db;
        const targetDb = targetConn.db;

        // Rollback Strategy: Drop Target DB if requested
        if (DROP_TARGET && !DRY_RUN) {
            logToFile('🗑️ Dropping target database as requested (--drop-target)...');
            await targetDb.dropDatabase();
        }

        const collections = await sourceDb.listCollections().toArray();
        let collectionNames = collections.map(c => c.name);

        // Filtering
        if (TARGET_COLLECTION) {
            collectionNames = collectionNames.filter(name => name === TARGET_COLLECTION);
            if (collectionNames.length === 0) throw new Error(`Collection ${TARGET_COLLECTION} not found in source.`);
        } else {
            collectionNames = collectionNames.filter(name => !EXCLUDED_COLLECTIONS.includes(name));
        }

        logToFile(`Found ${collectionNames.length} collections to process.`);

        for (const name of collectionNames) {
            logToFile(`\n📦 Collection: ${name}`);

            const sourceColl = sourceDb.collection(name);
            const targetColl = targetDb.collection(name);

            // --- DDL: Sync Indexes ---
            logToFile(`   🔍 Syncing indexes...`);
            const sourceIndexes = await sourceColl.indexes();
            for (const index of sourceIndexes) {
                if (index.name === '_id_') continue;
                if (!DRY_RUN) {
                    try {
                        const { key, name: indexName, ...options } = index;
                        // Clean options to remove internal fields
                        delete options.v;
                        delete options.ns;
                        await targetColl.createIndex(key, { ...options, name: indexName });
                    } catch (idxErr) {
                        logToFile(`   ⚠️ Warning indexing ${index.name}: ${idxErr.message}`);
                    }
                }
            }

            // --- DML: Batch Streaming ---
            const cursor = sourceColl.find({});
            let bulkOps = [];
            let totalProcessed = 0;
            let totalUpserted = 0;
            let totalModified = 0;

            while (await cursor.hasNext()) {
                const doc = await cursor.next();
                try {
                    const transformedDoc = transformAndValidate(name, doc);

                    // Idempotency: Use Upsert via BulkWrite
                    bulkOps.push({
                        updateOne: {
                            filter: { _id: transformedDoc._id },
                            update: { $set: transformedDoc },
                            upsert: true
                        }
                    });
                } catch (valError) {
                    logToFile(`   ❌ Validation Error: ${valError.message}`);
                }

                if (bulkOps.length >= BATCH_SIZE) {
                    if (!DRY_RUN) {
                        const result = await targetColl.bulkWrite(bulkOps);
                        totalUpserted += result.upsertedCount;
                        totalModified += result.modifiedCount;
                    }
                    totalProcessed += bulkOps.length;
                    logToFile(`   ⏳ Processed batch: ${totalProcessed} documents...`);
                    bulkOps = [];
                }
            }

            // Process remaining docs in the last batch
            if (bulkOps.length > 0) {
                if (!DRY_RUN) {
                    const result = await targetColl.bulkWrite(bulkOps);
                    totalUpserted += result.upsertedCount;
                    totalModified += result.modifiedCount;
                }
                totalProcessed += bulkOps.length;
            }

            if (DRY_RUN) {
                logToFile(`   ✅ Dry Run: Would process ${totalProcessed} documents.`);
            } else {
                logToFile(`   ✅ Collection complete: ${totalProcessed} total, ${totalUpserted} upserted, ${totalModified} modified.`);
            }
        }

        // Seeding
        if (!SKIP_SEED && !DRY_RUN) {
            logToFile('\n🌱 Running post-migration seeding...');
            const classesColl = targetDb.collection('classes');
            if (await classesColl.countDocuments() === 0) {
                await classesColl.insertMany([
                    { name: "10th", sections: ["A", "B", "C"], createdAt: new Date(), updatedAt: new Date() },
                    { name: "11th", sections: ["Biology", "Computer"], createdAt: new Date(), updatedAt: new Date() }
                ]);
                logToFile('   ✅ Seeded default classes.');
            }
        }

        // Migration Tracking (Versioning)
        if (!DRY_RUN) {
            logToFile('\n📝 Recording migration in tracking collection...');
            const logsColl = targetDb.collection('migration_logs');
            await logsColl.insertOne({
                version: 'v1.1',
                type: 'full-migration',
                executedAt: new Date(),
                status: 'success',
                collections_processed: collectionNames.length,
                dry_run: DRY_RUN
            });
        }

        logToFile('\n✨ Migration process completed.');

    } catch (error) {
        logToFile(`\n❌ CRITICAL ERROR: ${error.stack || error.message}`);
        process.exit(1);
    } finally {
        if (sourceConn) await sourceConn.close();
        if (targetConn) await targetConn.close();
        process.exit(0);
    }
}

copyDatabase();
