const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function exportDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    console.log('📊 Fetching database schema and data...\n');

    // Get all table names
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [process.env.DB_NAME || 'library_db']);

    let sqlContent = `CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

`;

    // Drop all tables
    for (const table of tables) {
      sqlContent += `DROP TABLE IF EXISTS ${table.TABLE_NAME};\n`;
    }
    sqlContent += '\n';

    // Get table schemas
    for (const table of tables) {
      const [schemaResult] = await connection.query(
        `SHOW CREATE TABLE ${table.TABLE_NAME}`
      );
      sqlContent += schemaResult[0]['Create Table'] + ';\n\n';
    }

    // Get data for each table
    for (const table of tables) {
      const [rows] = await connection.query(`SELECT * FROM ${table.TABLE_NAME}`);
      
      if (rows.length > 0) {
        const columnNames = Object.keys(rows[0]);
        const values = rows.map(row => {
          const vals = columnNames.map(col => {
            const value = row[col];
            if (value === null) return 'NULL';
            if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
            if (value instanceof Date) return `'${value.toISOString().split('T')[0]}'`;
            return value;
          });
          return `(${vals.join(',')})`;
        }).join(',\n');

        sqlContent += `INSERT INTO ${table.TABLE_NAME} (${columnNames.join(',')}) VALUES\n${values};\n\n`;
      }
    }

    // Add useful SELECT queries
    sqlContent += `-- View all data\nSELECT * FROM books;\nSELECT * FROM categories;\nSELECT * FROM members;\nSELECT * FROM staff;\nSELECT * FROM issued_books;\nSELECT * FROM reservations;\n`;

    // Save to file
    const filePath = path.join(__dirname, '..', 'database.sql');
    fs.writeFileSync(filePath, sqlContent, 'utf8');

    console.log(`✅ Database exported successfully!`);
    console.log(`📁 File saved: ${filePath}`);
    console.log(`📝 Total tables: ${tables.length}`);
    console.log(`📊 Total records: ${rows.length}`);

  } catch (error) {
    console.error('❌ Error exporting database:', error.message);
    process.exit(1);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

exportDatabase();
