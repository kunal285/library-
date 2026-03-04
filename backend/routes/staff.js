const express = require('express');
const Staff = require('../models/Staff');

const router = express.Router();

// GET /staff -> Fetch all staff members.
router.get('/staff', async (req, res) => {
  try {
    const staff = await Staff.find().sort({ _id: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
  }
});

// POST /staff -> Add a staff member.
router.post('/staff', async (req, res) => {
  try {
    const { name, email, phone, role, hire_date } = req.body;

    if (!name || !email || !phone || !role || !hire_date) {
      return res.status(400).json({ message: 'All staff fields are required' });
    }

    const staffMember = new Staff({ name, email, phone, role, hire_date });
    const savedStaff = await staffMember.save();

    res.status(201).json({ message: 'Staff added successfully', staff_id: savedStaff._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Staff email already exists' });
    }
    res.status(500).json({ message: 'Failed to add staff', error: error.message });
  }
});

// DELETE /staff/:id -> Delete staff by ID.
router.delete('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findByIdAndDelete(id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete staff', error: error.message });
  }
});

module.exports = router;
