export const up = async (db) => {
    console.log('Adding missing indexes...');

    // 1. Leaves Collection
    await db.collection('leaves').createIndex({ applicant: 1 });
    await db.collection('leaves').createIndex({ status: 1 });
    await db.collection('leaves').createIndex({ leaveType: 1 });

    // 2. Notifications Collection
    await db.collection('notifications').createIndex({ recipientGroup: 1 });
    await db.collection('notifications').createIndex({ status: 1 });
    await db.collection('notifications').createIndex({ sender: 1 });

    // 3. Attendances Collection
    // Use unique index to prevent duplicate attendance for the same student on the same day
    await db.collection('attendances').createIndex({ studentId: 1, date: 1 }, { unique: true });
    await db.collection('attendances').createIndex({ classId: 1 });

    // 4. Fees Collection
    await db.collection('fees').createIndex({ studentId: 1 });
    await db.collection('fees').createIndex({ status: 1 });
    await db.collection('fees').createIndex({ dueDate: 1 });

    // 5. Results Collection
    // Unique result for a student in a specific exam subject
    await db.collection('results').createIndex({ studentId: 1, examId: 1, subject: 1 }, { unique: true });
    await db.collection('results').createIndex({ studentId: 1 });

    console.log('✅ Missing indexes added successfully.');
};

export const down = async (db) => {
    console.log('Dropping missing indexes...');

    await db.collection('leaves').dropIndex('applicant_1');
    await db.collection('leaves').dropIndex('status_1');
    await db.collection('leaves').dropIndex('leaveType_1');

    await db.collection('notifications').dropIndex('recipientGroup_1');
    await db.collection('notifications').dropIndex('status_1');
    await db.collection('notifications').dropIndex('sender_1');

    await db.collection('attendances').dropIndex('studentId_1_date_1');
    await db.collection('attendances').dropIndex('classId_1');

    await db.collection('fees').dropIndex('studentId_1');
    await db.collection('fees').dropIndex('status_1');
    await db.collection('fees').dropIndex('dueDate_1');

    await db.collection('results').dropIndex('studentId_1_examId_1_subject_1');
    await db.collection('results').dropIndex('studentId_1');

    console.log('✅ Missing indexes dropped successfully.');
};
