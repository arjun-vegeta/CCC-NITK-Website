const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // MDX files table
      db.run(`
        CREATE TABLE IF NOT EXISTS mdx_files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          filename TEXT NOT NULL,
          filepath TEXT UNIQUE NOT NULL,
          category TEXT NOT NULL,
          content TEXT NOT NULL,
          title TEXT,
          last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
          modified_by INTEGER,
          FOREIGN KEY (modified_by) REFERENCES users(id)
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Create default admin user if not exists
      const defaultPassword = 'admin123'; // Change this!
      bcrypt.hash(defaultPassword, 10, (err, hash) => {
        if (err) {
          reject(err);
          return;
        }

        db.run(
          `INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)`,
          ['admin', hash, 'admin@example.com'],
          (err) => {
            if (err) reject(err);
            else {
              console.log('✅ Database initialized');
              resolve();
            }
          }
        );
      });
    });
  });
};

module.exports = { db, initDatabase };
