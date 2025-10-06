const fs = require('fs').promises;
const path = require('path');
const { db } = require('../utils/database');

const CONTENT_BASE_PATH = path.join(__dirname, '../../../src/content');

// Get all MDX files by category
const getFilesByCategory = async (req, res) => {
  const { category } = req.params; // 'guides' or 'facilities'
  
  try {
    const categoryPath = path.join(CONTENT_BASE_PATH, category);
    const files = await fs.readdir(categoryPath);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));
    
    const fileList = await Promise.all(
      mdxFiles.map(async (filename) => {
        const filepath = path.join(categoryPath, filename);
        const content = await fs.readFile(filepath, 'utf-8');
        const stats = await fs.stat(filepath);
        
        // Extract title from frontmatter
        const titleMatch = content.match(/title:\s*["'](.+?)["']/);
        const title = titleMatch ? titleMatch[1] : filename.replace('.mdx', '');
        
        return {
          filename,
          filepath: `${category}/${filename}`,
          title,
          lastModified: stats.mtime,
          size: stats.size
        };
      })
    );
    
    res.json({ files: fileList });
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files' });
  }
};

// Get single MDX file content
const getFile = async (req, res) => {
  const { category, filename } = req.params;
  
  try {
    const filepath = path.join(CONTENT_BASE_PATH, category, filename);
    const content = await fs.readFile(filepath, 'utf-8');
    
    res.json({
      filename,
      filepath: `${category}/${filename}`,
      content
    });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(404).json({ error: 'File not found' });
  }
};

// Update MDX file
const updateFile = async (req, res) => {
  const { category, filename } = req.params;
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  try {
    const filepath = path.join(CONTENT_BASE_PATH, category, filename);
    await fs.writeFile(filepath, content, 'utf-8');
    
    // Log to database
    db.run(
      `INSERT OR REPLACE INTO mdx_files (filename, filepath, category, content, modified_by, last_modified)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [filename, `${category}/${filename}`, category, content, req.userId],
      (err) => {
        if (err) console.error('Database log error:', err);
      }
    );
    
    res.json({ success: true, message: 'File updated successfully' });
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ error: 'Failed to update file' });
  }
};

// Create new MDX file
const createFile = async (req, res) => {
  const { category } = req.params;
  const { filename, content } = req.body;
  
  if (!filename || !content) {
    return res.status(400).json({ error: 'Filename and content are required' });
  }
  
  // Ensure filename ends with .mdx
  const mdxFilename = filename.endsWith('.mdx') ? filename : `${filename}.mdx`;
  
  try {
    const filepath = path.join(CONTENT_BASE_PATH, category, mdxFilename);
    
    // Check if file already exists
    try {
      await fs.access(filepath);
      return res.status(409).json({ error: 'File already exists' });
    } catch {
      // File doesn't exist, proceed with creation
    }
    
    await fs.writeFile(filepath, content, 'utf-8');
    
    // Log to database
    db.run(
      `INSERT INTO mdx_files (filename, filepath, category, content, modified_by, last_modified)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [mdxFilename, `${category}/${mdxFilename}`, category, content, req.userId],
      (err) => {
        if (err) console.error('Database log error:', err);
      }
    );
    
    res.json({ 
      success: true, 
      message: 'File created successfully',
      filename: mdxFilename
    });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ error: 'Failed to create file' });
  }
};

// Delete MDX file
const deleteFile = async (req, res) => {
  const { category, filename } = req.params;
  
  try {
    const filepath = path.join(CONTENT_BASE_PATH, category, filename);
    await fs.unlink(filepath);
    
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

// Sync all existing files to database
const syncFiles = async (req, res) => {
  try {
    const categories = ['guides', 'facilities'];
    let syncedCount = 0;
    
    for (const category of categories) {
      const categoryPath = path.join(CONTENT_BASE_PATH, category);
      
      try {
        const files = await fs.readdir(categoryPath);
        const mdxFiles = files.filter(file => file.endsWith('.mdx'));
        
        for (const filename of mdxFiles) {
          const filepath = path.join(categoryPath, filename);
          const content = await fs.readFile(filepath, 'utf-8');
          
          // Extract title from frontmatter
          const titleMatch = content.match(/title:\s*["'](.+?)["']/);
          const title = titleMatch ? titleMatch[1] : filename.replace('.mdx', '');
          
          // Insert or update in database
          await new Promise((resolve, reject) => {
            db.run(
              `INSERT OR REPLACE INTO mdx_files (filename, filepath, category, content, title, modified_by, last_modified)
               VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
              [filename, `${category}/${filename}`, category, content, title, req.userId],
              (err) => {
                if (err) reject(err);
                else {
                  syncedCount++;
                  resolve();
                }
              }
            );
          });
        }
      } catch (err) {
        console.error(`Error syncing ${category}:`, err);
      }
    }
    
    res.json({ 
      success: true, 
      message: `Synced ${syncedCount} files`,
      count: syncedCount
    });
  } catch (error) {
    console.error('Error syncing files:', error);
    res.status(500).json({ error: 'Failed to sync files' });
  }
};

module.exports = {
  getFilesByCategory,
  getFile,
  updateFile,
  createFile,
  deleteFile,
  syncFiles
};
