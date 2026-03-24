import bcrypt from 'bcrypt';

export const up = async (db) => {
    const email = 'admin@gmail.com';

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ email });

    if (existingAdmin) {
        console.log('Admin user already exists. Skipping seed.');
        return;
    }

    console.log('Seeding admin user...');

    // Hash password manually since we are using the driver directly
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.collection('users').insertOne({
        name: 'Admin User',
        email: email,
        password: hashedPassword,
        role: 'admin',
        phone: '1234567890',
        gender: 'male',
        address: 'Admin Office',
        dateOfBirth: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    console.log('Admin user seeded successfully.');
};

export const down = async (db) => {
    console.log('Removing seeded admin user...');
    await db.collection('users').deleteOne({ email: 'admin@gmail.com' });
};
