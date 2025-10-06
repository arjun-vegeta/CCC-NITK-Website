const fs = require('fs').promises;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../database.sqlite');
const contentPath = path.join(__dirname, '../../src/content');

const db = new sqlite3.Database(dbPath);

async function migrateContent() {
    console.log('🚀 Starting content migration...\n');

    const categories = ['guides', 'facilities'];
    let totalMigrated = 0;

    for (const category of categories) {
        console.log(`📁 Processing ${category}...`);
        const categoryPath = path.join(contentPath, category);

        try {
            const files = await fs.readdir(categoryPath);
            const mdxFiles = files.filter(file => file.endsWith('.mdx'));

            console.log(`   Found ${mdxFiles.length} MDX files`);

            for (const filename of mdxFiles) {
                const filepath = path.join(categoryPath, filename);
                const content = await fs.readFile(filepath, 'utf-8');

                // Extract title from frontmatter
                const titleMatch = content.match(/title:\s*["'](.+?)["']/);
                const title = titleMatch ? titleMatch[1] : filename.replace('.mdx', '');

                // Insert into database
                await new Promise((resolve, reject) => {
                    db.run(
                        `INSERT OR REPLACE INTO mdx_files (filename, filepath, category, content, title, last_modified)
             VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                        [filename, `${category}/${filename}`, category, content, title],
                        (err) => {
                            if (err) {
                                console.error(`   ❌ Error migrating ${filename}:`, err.message);
                                reject(err);
                            } else {
                                console.log(`   ✅ Migrated: ${filename} (${title})`);
                                totalMigrated++;
                                resolve();
                            }
                        }
                    );
                });
            }

            console.log(`   ✅ Completed ${category}\n`);
        } catch (err) {
            console.error(`   ❌ Error processing ${category}:`, err.message);
        }
    }

    console.log(`\n🎉 Migration complete! Migrated ${totalMigrated} files.`);
    db.close();
}

// Run migration
migrateContent().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
