const bcrypt = require('bcryptjs');

async function generatePasswords() {
  const admin123 = await bcrypt.hash('admin123', 10);
  const emp123 = await bcrypt.hash('emp123', 10);
  
  console.log('Password Hashes Generated:');
  console.log('========================');
  console.log('\nFor password: admin123');
  console.log(admin123);
  console.log('\nFor password: emp123');
  console.log(emp123);
  console.log('\n========================');
}

generatePasswords();
