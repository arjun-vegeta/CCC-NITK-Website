const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const readline = require('readline');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function changePassword() {
  console.log('\n🔐 Admin Password Change Tool\n');
  
  try {
    const username = await question('Enter admin username (default: admin): ') || 'admin';
    const newPassword = await question('Enter new password: ');
    
    if (!newPassword || newPassword.length < 6) {
      console.error('❌ Password must be at least 6 characters long');
      rl.close();
      db.close();
      return;
    }
    
    const confirmPassword = await question('Confirm new password: ');
    
    if (newPassword !== confirmPassword) {
      console.error('❌ Passwords do not match');
      rl.close();
      db.close();
      return;
    }
    
    // Hash the new password
    const hash = await bcrypt.hash(newPassword, 10);
    
    // Update the password in database
    db.run(
      'UPDATE users SET password = ? WHERE username = ?',
      [hash, username],
      function(err) {
        if (err) {
          console.error('❌ Error updating password:', err.message);
        } else if (this.changes === 0) {
          console.error(`❌ User '${username}' not found`);
        } else {
          console.log(`\n✅ Password updated successfully for user '${username}'`);
        }
        
        rl.close();
        db.close();
      }
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    db.close();
  }
}

changePassword();
