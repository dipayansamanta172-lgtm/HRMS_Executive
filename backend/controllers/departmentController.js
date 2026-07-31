const db = require('../config/db');
const { logAction } = require('../utils/auditLogger');

const departmentController = {
  getDepartments: async (req, res) => {
    const companyId = req.user.employee ? req.user.employee.company_id : null;
    if (!companyId) {
      return res.status(400).json({ message: 'User is not associated with any company.' });
    }

    try {
      const query = `
        SELECT d.*, 
          COUNT(e.id) AS employee_count,
          head.name AS department_head_name
        FROM departments d 
        LEFT JOIN employees e ON d.id = e.department_id AND e.status != 'Deleted'
        LEFT JOIN employees head ON d.department_head = head.id
        WHERE d.company_id = ?
        GROUP BY d.id
        ORDER BY d.name ASC
      `;
      const [depts] = await db.query(query, [companyId]);
      return res.status(200).json(depts);
    } catch (err) {
      console.error('Fetch departments error:', err);
      return res.status(500).json({ message: 'Failed to fetch departments.' });
    }
  },

  createDepartment: async (req, res) => {
    const { name, department_code, description, department_head, status } = req.body;
    
    if (!name || !department_code) {
      return res.status(400).json({ message: 'Name and department code are required fields.' });
    }

    const companyId = req.user.employee ? req.user.employee.company_id : null;
    if (!companyId) {
      return res.status(400).json({ message: 'User is not associated with any company.' });
    }

    try {
      // Check unique constraints within this company
      const [existing] = await db.query(
        'SELECT * FROM departments WHERE (name = ? OR department_code = ?) AND company_id = ? LIMIT 1',
        [name.toUpperCase(), department_code.toUpperCase(), companyId]
      );

      if (existing.length > 0) {
        return res.status(400).json({ message: 'Department Name or Code already exists in your company.' });
      }

      const [result] = await db.query(
        'INSERT INTO departments (name, department_code, description, department_head, status, created_by, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          name.toUpperCase(), 
          department_code.toUpperCase(), 
          description || null, 
          department_head || null, 
          status || 'Active', 
          req.user.id, 
          companyId
        ]
      );

      // Audit Log
      await logAction(req.user.id, 'Department Created', 'departments', result.insertId);

      return res.status(201).json({
        success: true,
        message: 'Department created successfully.',
        department: {
          id: result.insertId,
          name: name.toUpperCase(),
          department_code: department_code.toUpperCase(),
          description: description || null,
          department_head: department_head || null,
          status: status || 'Active',
          created_by: req.user.id,
        },
      });
    } catch (err) {
      console.error('Create department error:', err);
      return res.status(500).json({ message: 'Failed to create department.' });
    }
  },

  updateDepartment: async (req, res) => {
    const { id } = req.params;
    const { name, department_code, description, department_head, status } = req.body;

    if (!name || !department_code) {
      return res.status(400).json({ message: 'Name and department code are required fields.' });
    }

    const companyId = req.user.employee ? req.user.employee.company_id : null;
    if (!companyId) {
      return res.status(400).json({ message: 'User is not associated with any company.' });
    }

    try {
      // Check exists
      const [existing] = await db.query('SELECT * FROM departments WHERE id = ? AND company_id = ?', [id, companyId]);
      if (existing.length === 0) {
        return res.status(404).json({ message: 'Department not found in your company.' });
      }

      // Check unique constraints against other departments in the same company
      const [duplicate] = await db.query(
        'SELECT * FROM departments WHERE (name = ? OR department_code = ?) AND id != ? AND company_id = ? LIMIT 1',
        [name.toUpperCase(), department_code.toUpperCase(), id, companyId]
      );

      if (duplicate.length > 0) {
        return res.status(400).json({ message: 'Another department with same name or code already exists in your company.' });
      }

      await db.query(
        'UPDATE departments SET name = ?, department_code = ?, description = ?, department_head = ?, status = ? WHERE id = ?',
        [name.toUpperCase(), department_code.toUpperCase(), description || null, department_head || null, status || 'Active', id]
      );

      // Audit Log
      await logAction(req.user.id, 'Department Updated', 'departments', id);

      return res.status(200).json({
        success: true,
        message: 'Department updated successfully.',
        department: { 
          id, 
          name: name.toUpperCase(), 
          department_code: department_code.toUpperCase(),
          description: description || null,
          department_head: department_head || null,
          status: status || 'Active'
        },
      });
    } catch (err) {
      console.error('Update department error:', err);
      return res.status(500).json({ message: 'Failed to update department.' });
    }
  },

  deleteDepartment: async (req, res) => {
    const { id } = req.params;

    const companyId = req.user.employee ? req.user.employee.company_id : null;
    if (!companyId) {
      return res.status(400).json({ message: 'User is not associated with any company.' });
    }

    try {
      const [existing] = await db.query('SELECT * FROM departments WHERE id = ? AND company_id = ?', [id, companyId]);
      if (existing.length === 0) {
        return res.status(404).json({ message: 'Department not found in your company.' });
      }

      const [employees] = await db.query('SELECT COUNT(*) AS count FROM employees WHERE department_id = ? AND status != "Deleted"', [id]);
      if (employees[0].count > 0) {
        return res.status(400).json({ 
          message: `This department cannot be deleted because it currently has ${employees[0].count} employee(s). Please reassign those employees before deleting the department.`
        });
      }

      await db.query('DELETE FROM departments WHERE id = ?', [id]);

      // Audit Log
      await logAction(req.user.id, 'Department Deleted', 'departments', id);

      return res.status(200).json({ success: true, message: 'Department deleted successfully.' });
    } catch (err) {
      console.error('Delete department error:', err);
      return res.status(500).json({ message: 'Failed to delete department.' });
    }
  },
};

module.exports = departmentController;
