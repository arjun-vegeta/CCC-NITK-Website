const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('\n👥 Admin Users List\n');

db.all('SELECT id, username, email, created_at FROM users', [], (err, rows) => {
  if (err) {
    console.error('❌ Error fetching users:', err.message);
    db.close();
    return;
  }
  
  if (rows.length === 0) {
    console.log('No users found in database');
  } else {
    console.log('ID | Username       | Email                  | Created At');
    console.log('---|----------------|------------------------|---------------------------');
    rows.forEach(row => {
      const id = String(row.id).padEnd(2);
      const username = String(row.username).padEnd(14);
      const email = String(row.email || 'N/A').padEnd(22);
      const created = new Date(row.created_at).toLocaleString();
      console.log(`${id} | ${username} | ${email} | ${created}`);
    });
  }
  
  console.log('');
  db.close();
});
