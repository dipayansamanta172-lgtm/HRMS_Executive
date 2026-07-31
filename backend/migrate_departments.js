const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hrms_db'
  });

  try {
    console.log('Starting migration...');
    // Drop existing unique constraints
    try {
      await connection.query('ALTER TABLE departments DROP INDEX name;');
    } catch (e) { console.log('Index name not found or already dropped.'); }
    try {
      await connection.query('ALTER TABLE departments DROP INDEX department_code;');
    } catch (e) { console.log('Index department_code not found or already dropped.'); }

    // Add new columns
    try {
      await connection.query('ALTER TABLE departments ADD COLUMN description TEXT;');
    } catch (e) { console.log('Column description already exists.'); }
    
    try {
      await connection.query('ALTER TABLE departments ADD COLUMN department_head INT;');
    } catch (e) { console.log('Column department_head already exists.'); }

    try {
      await connection.query("ALTER TABLE departments ADD COLUMN status VARCHAR(50) DEFAULT 'Active';");
    } catch (e) { console.log('Column status already exists.'); }

    // Add composite constraints
    try {
      await connection.query('ALTER TABLE departments ADD UNIQUE KEY unique_name_company (name, company_id);');
    } catch (e) { console.log('Unique key unique_name_company already exists.'); }
    
    try {
      await connection.query('ALTER TABLE departments ADD UNIQUE KEY unique_code_company (department_code, company_id);');
    } catch (e) { console.log('Unique key unique_code_company already exists.'); }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

runMigration();
