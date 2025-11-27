const { User } = require('../models');
const sequelize = require('../config/database');

async function createAllUsers() {
  try {
    await sequelize.sync();
    
    console.log('Creating all test users...\n');

    const users = [
      { username: 'admin', email: 'admin@company.com', password: 'admin123', fullName: 'System Administrator', role: 'admin' },
      { username: 'john.doe', email: 'john.doe@company.com', password: 'emp123', fullName: 'John Doe', role: 'employee' },
      { username: 'jane.smith', email: 'jane.smith@company.com', password: 'emp123', fullName: 'Jane Smith', role: 'employee' },
      { username: 'mike.johnson', email: 'mike.johnson@company.com', password: 'emp123', fullName: 'Mike Johnson', role: 'employee' },
      { username: 'sarah.williams', email: 'sarah.williams@company.com', password: 'emp123', fullName: 'Sarah Williams', role: 'employee' },
      { username: 'david.brown', email: 'david.brown@company.com', password: 'emp123', fullName: 'David Brown', role: 'employee' },
      { username: 'emily.davis', email: 'emily.davis@company.com', password: 'emp123', fullName: 'Emily Davis', role: 'employee' }
    ];

    for (const userData of users) {
      const existing = await User.findOne({ where: { username: userData.username } });
      
      if (existing) {
        await existing.update({
          password: userData.password,
          isActive: true
        });
        console.log(`✓ Updated: ${userData.username} / ${userData.password}`);
      } else {
        await User.create({
          ...userData,
          isActive: true
        });
        console.log(`✓ Created: ${userData.username} / ${userData.password}`);
      }
    }

    console.log('\n========================================');
    console.log('✓ All users ready!');
    console.log('========================================');
    console.log('\nLogin with any of these:');
    console.log('  admin / admin123');
    console.log('  john.doe / emp123');
    console.log('  jane.smith / emp123');
    console.log('  mike.johnson / emp123');
    console.log('  sarah.williams / emp123');
    console.log('  david.brown / emp123');
    console.log('  emily.davis / emp123');
    console.log('========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAllUsers();
