const db = require('./config/db');

async function run() {
  try {
    await db.query(`ALTER TABLE audit_logs ADD COLUMN severity ENUM('info', 'warning', 'danger', 'success') DEFAULT 'info'`);
    console.log('ALTER TABLE SUCCESS');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Field already exists.');
    } else {
      console.error('ERROR:', err);
    }
  } finally {
    process.exit(0);
  }
}

run();
