const express = require('express');
const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const Member = require('../models/Member');

const router = express.Router();

// GET /reservations -> Fetch all reservations.
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ _id: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reservations', error: error.message });
  }
});

// GET /reservations/details -> Reservation details with book and member info.
router.get('/reservations/details', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('book_id', 'title')
      .populate('member_id', 'name')
      .sort({ _id: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reservation details', error: error.message });
  }
});

// POST /reservations -> Add a reservation.
router.post('/reservations', async (req, res) => {
  try {
    const { book_id, member_id, reservation_date, expiry_date, status } = req.body;

    if (!book_id || !member_id || !reservation_date || !expiry_date) {
      return res
        .status(400)
        .json({ message: 'book_id, member_id, reservation_date and expiry_date are required' });
    }

    const reservation = new Reservation({
      book_id,
      member_id,
      reservation_date,
      expiry_date,
      status: status || 'Active',
    });

    const savedReservation = await reservation.save();
    res
      .status(201)
      .json({ message: 'Reservation created successfully', reservation_id: savedReservation._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create reservation', error: error.message });
  }
});

// PUT /reservations/:id -> Update reservation status or expiry date.
router.put('/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { expiry_date, status } = req.body;

    if (!expiry_date && !status) {
      return res.status(400).json({ message: 'Provide expiry_date or status to update reservation' });
    }

    const updateData = {};
    if (expiry_date) updateData.expiry_date = expiry_date;
    if (status) updateData.status = status;

    const reservation = await Reservation.findByIdAndUpdate(id, updateData, { new: true });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({ message: 'Reservation updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update reservation', error: error.message });
  }
});

module.exports = router;
