const bcrypt = require('bcryptjs');
const { User } = require('../models');
const sequelize = require('../config/database');

async function createTestUser() {
  try {
    await sequelize.sync();
    
    console.log('Creating test users...\n');

    // Create admin
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (adminExists) {
      await adminExists.update({
        password: 'admin123'
      });
      console.log('✓ Admin password updated: admin / admin123');
    } else {
      await User.create({
        username: 'admin',
        email: 'admin@company.com',
        password: 'admin123',
        fullName: 'System Administrator',
        role: 'admin',
        isActive: true
      });
      console.log('✓ Admin created: admin / admin123');
    }

    // Create test employee
    const empExists = await User.findOne({ where: { username: 'testuser' } });
    if (empExists) {
      await empExists.update({
        password: 'emp123'
      });
      console.log('✓ Test employee password updated: testuser / emp123');
    } else {
      await User.create({
        username: 'testuser',
        email: 'testuser@company.com',
        password: 'emp123',
        fullName: 'Test Employee',
        role: 'employee',
        isActive: true
      });
      console.log('✓ Test employee created: testuser / emp123');
    }

    console.log('\n✓ Test users ready!');
    console.log('\nLogin credentials:');
    console.log('  Admin:    admin / admin123');
    console.log('  Employee: testuser / emp123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestUser();
