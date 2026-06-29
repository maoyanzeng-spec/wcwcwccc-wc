import express, { Request, Response } from 'express';
import db from '../db/database';

const router = express.Router();

// Middleware to check admin key
const checkAdminKey = (req: Request, res: Response, next: Function) => {
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  const expectedKey = process.env.ADMIN_KEY;
  
  if (!expectedKey) {
    return res.status(500).json({ error: 'ADMIN_KEY not configured' });
  }
  
  if (adminKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Export database as SQL dump
router.get('/export-db', checkAdminKey, (_req: Request, res: Response) => {
  try {
    // Get all table names
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all() as Array<{ name: string }>;
    
    let sqlDump = '-- SQLite Database Dump\n';
    sqlDump += `-- Generated: ${new Date().toISOString()}\n`;
    sqlDump += '-- Database: worldcup.db\n\n';
    sqlDump += 'PRAGMA foreign_keys = OFF;\n\n';
    
    // Export each table
    for (const table of tables) {
      const tableName = table.name;
      
      // Get CREATE TABLE statement
      const createStmt = db.prepare(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name=?"
      ).get(tableName) as { sql: string } | undefined;
      
      if (createStmt && createStmt.sql) {
        sqlDump += `${createStmt.sql};\n\n`;
      }
      
      // Get all data from table
      const rows = db.prepare(`SELECT * FROM ${tableName}`).all() as Array<Record<string, any>>;
      
      if (rows.length > 0) {
        // Get column names
        const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
        const columnNames = columns.map(col => col.name);
        
        for (const row of rows) {
          const values = columnNames.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            return val;
          }).join(', ');
          
          sqlDump += `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${values});\n`;
        }
        sqlDump += '\n';
      }
    }
    
    sqlDump += 'PRAGMA foreign_keys = ON;\n';
    
    // Send as downloadable file
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="worldcup-backup-${new Date().toISOString().split('T')[0]}.sql"`);
    res.send(sqlDump);
    
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ error: 'Failed to export database' });
  }
});

export default router;

