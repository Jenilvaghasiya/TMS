const sequelize = require('./config/database');

async function fixJsonColumns() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected!');

    // Drop tables if they exist (in correct order due to foreign keys)
    console.log('Dropping existing tables...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await sequelize.query('DROP TABLE IF EXISTS TaskUpdates;');
    await sequelize.query('DROP TABLE IF EXISTS TaskAssignments;');
    await sequelize.query('DROP TABLE IF EXISTS Tasks;');
    await sequelize.query('DROP TABLE IF EXISTS Couriers;');
    await sequelize.query('DROP TABLE IF EXISTS Users;');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Tables dropped successfully!');

    // Now sync will create fresh tables with TEXT instead of JSON
    await sequelize.sync({ force: false });
    console.log('Tables created successfully!');

    console.log('\n✓ Database fixed! You can now run: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixJsonColumns();
