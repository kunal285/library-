const express = require('express');
const Member = require('../models/Member');

const router = express.Router();

// GET /members -> Fetch all members.
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ _id: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members', error: error.message });
  }
});

// GET /stats/members -> Count total member records.
router.get('/stats/members', async (req, res) => {
  try {
    const total_members = await Member.countDocuments();
    res.json({ total_members });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members count', error: error.message });
  }
});

// POST /members -> Add a new member.
router.post('/members', async (req, res) => {
  try {
    const { name, email, phone, membership_date, address, membership_type, status } = req.body;

    if (!name || !email || !phone || !membership_date) {
      return res.status(400).json({ message: 'All member fields are required' });
    }

    const member = new Member({
      name,
      email,
      phone,
      address: address || undefined,
      membership_type: membership_type || 'Regular',
      membership_date,
      status: status || 'Active',
    });

    const savedMember = await member.save();
    res.status(201).json({ message: 'Member added successfully', member_id: savedMember._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists. Use a unique email.' });
    }

    res.status(500).json({ message: 'Failed to add member', error: error.message });
  }
});

// PUT /members/:id -> Update member details.
router.put('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, membership_date, address, membership_type, status } = req.body;

    if (!name || !email || !phone || !membership_date) {
      return res.status(400).json({ message: 'name, email, phone and membership_date are required' });
    }

    const member = await Member.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        address: address || undefined,
        membership_type: membership_type || 'Regular',
        membership_date,
        status: status || 'Active',
      },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists. Use a unique email.' });
    }
    res.status(500).json({ message: 'Failed to update member', error: error.message });
  }
});

// DELETE /members/:id -> Delete member by ID.
router.delete('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete member', error: error.message });
  }
});

module.exports = router;
