const db = require('../config/db');

/**
 * Log a user action to the audit_logs table
 * @param {number|null} userId - The user performing the action
 * @param {string} action - The action name (e.g. 'Employee Created')
 * @param {string} tableName - The table modified (e.g. 'employees')
 * @param {string|number} recordId - The primary key of the record modified
 * @param {string} severity - Severity level (info, warning, danger, success)
 */
const logAction = async (userId, action, tableName, recordId, severity = 'info') => {
  try {
    const [userRows] = await db.query('SELECT company_id FROM employees WHERE user_id = ? LIMIT 1', [userId]);
    const companyId = userRows.length > 0 ? userRows[0].company_id : null;

    await db.query(
      'INSERT INTO audit_logs (company_id, user_id, action, table_name, record_id, severity) VALUES (?, ?, ?, ?, ?, ?)',
      [companyId, userId, action, tableName, String(recordId), severity]
    );
  } catch (err) {
    console.error('Audit log failed to write:', err.message);
  }
};

module.exports = { logAction };
