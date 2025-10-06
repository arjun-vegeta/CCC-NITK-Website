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

async function createAdminUser() {
  console.log('\n👤 Create New Admin User\n');
  
  try {
    const username = await question('Enter username: ');
    
    if (!username || username.length < 3) {
      console.error('❌ Username must be at least 3 characters long');
      rl.close();
      db.close();
      return;
    }
    
    const password = await question('Enter password: ');
    
    if (!password || password.length < 6) {
      console.error('❌ Password must be at least 6 characters long');
      rl.close();
      db.close();
      return;
    }
    
    const confirmPassword = await question('Confirm password: ');
    
    if (password !== confirmPassword) {
      console.error('❌ Passwords do not match');
      rl.close();
      db.close();
      return;
    }
    
    const email = await question('Enter email (optional): ') || null;
    
    // Hash the password
    const hash = await bcrypt.hash(password, 10);
    
    // Insert new user
    db.run(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hash, email],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            console.error(`❌ User '${username}' already exists`);
          } else {
            console.error('❌ Error creating user:', err.message);
          }
        } else {
          console.log(`\n✅ Admin user '${username}' created successfully`);
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

createAdminUser();
