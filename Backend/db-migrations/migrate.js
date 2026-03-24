import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from Backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school-management';
const MIGRATIONS_DIR = __dirname;
const COLLECTION_NAME = 'migrations';

async function migrate() {
    console.log('\n--- MongoDB Migration Runner ---');
    console.log(`Current working directory: ${process.cwd()}`);

    try {
        console.log(`Connecting to: ${MONGO_URI}`);
        const options = { serverSelectionTimeoutMS: 5000 };
        await mongoose.connect(MONGO_URI, options);
        console.log('✅ Connected successfully.');
        const db = mongoose.connection.db;
        const migrationsCollection = db.collection(COLLECTION_NAME);

        // Get all migration files
        const files = fs.readdirSync(MIGRATIONS_DIR)
            .filter(f => f.match(/^\d+.*\.js$/))
            .sort();

        // Get executed migrations from DB
        const executedMigrations = await migrationsCollection.find().sort({ name: 1 }).toArray();
        const executedNames = executedMigrations.map(m => m.name);

        const isDown = process.argv.includes('--down');

        if (isDown) {
            if (executedNames.length === 0) {
                console.log('No migrations to rollback.');
                process.exit(0);
            }

            const lastMigrationName = executedNames[executedNames.length - 1];
            console.log(`Rolling back (down): ${lastMigrationName}`);

            const migrationPath = path.join(MIGRATIONS_DIR, lastMigrationName);
            const migration = await import(`file://${migrationPath}`);

            if (migration.down) {
                await migration.down(db);
                await migrationsCollection.deleteOne({ name: lastMigrationName });
                console.log(`✅ Rollback successful: ${lastMigrationName}`);
            } else {
                console.log(`⚠️ No down function found in: ${lastMigrationName}`);
            }
            process.exit(0);
        }

        // Run pending migrations (Up)
        let runCount = 0;
        for (const file of files) {
            if (!executedNames.includes(file)) {
                console.log(`Applying (up): ${file}`);

                const migrationPath = path.join(MIGRATIONS_DIR, file);
                const migration = await import(`file://${migrationPath}`);

                if (migration.up) {
                    await migration.up(db);
                    await migrationsCollection.insertOne({
                        name: file,
                        executedAt: new Date()
                    });
                    console.log(` Migration successful: ${file}`);
                    runCount++;
                } else {
                    console.log(`⚠️ No up function found in: ${file}`);
                }
            }
        }

        if (runCount === 0) {
            console.log(' Database is up to date. No pending migrations.');
        } else {
            console.log(` Completed ${runCount} migration(s).`);
        }

    } catch (error) {
        console.error(' Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
