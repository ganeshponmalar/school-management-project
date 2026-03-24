export const up = async (db) => {
    console.log('Creating indexes...');

    // 1. Users Collection
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    // 2. Admissions Collection
    await db.collection('admissions').createIndex({ email: 1 }, { unique: true });

    // 3. Classes Collection
    await db.collection('classes').createIndex({ name: 1 }, { unique: true });

    // 4. Students Collection
    await db.collection('students').createIndex({ userId: 1 }, { unique: true });
    await db.collection('students').createIndex({ rollNumber: 1, classId: 1 }, { unique: true });

    // 5. Teachers Collection
    await db.collection('teachers').createIndex({ userId: 1 }, { unique: true });

    // 6. Exams Collection
    await db.collection('exams').createIndex({ name: 1, classId: 1 }, { unique: true });
};

export const down = async (db) => {
    console.log('Dropping indexes...');

    await db.collection('users').dropIndex('email_1');
    await db.collection('admissions').dropIndex('email_1');
    await db.collection('classes').dropIndex('name_1');
    await db.collection('students').dropIndex('userId_1');
    await db.collection('students').dropIndex('rollNumber_1_classId_1');
    await db.collection('teachers').dropIndex('userId_1');
    await db.collection('exams').dropIndex('name_1_classId_1');
};
