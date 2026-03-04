const express = require('express');
const IssuedBook = require('../models/IssuedBook');
const Book = require('../models/Book');
const Member = require('../models/Member');
const Staff = require('../models/Staff');

const router = express.Router();

// GET /issues -> Fetch all issue records.
router.get('/issues', async (req, res) => {
  try {
    const issues = await IssuedBook.find()
      .populate('book_id', 'title')
      .populate('member_id', 'name')
      .populate('staff_id', 'name')
      .sort({ _id: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch issues', error: error.message });
  }
});

// GET /stats/issues -> Count total issued book records.
router.get('/stats/issues', async (req, res) => {
  try {
    const total_issued_books = await IssuedBook.countDocuments();
    res.json({ total_issued_books });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch issues count', error: error.message });
  }
});

// GET /issues/member/:id -> Get issue records for one member.
router.get('/issues/member/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const issues = await IssuedBook.find({ member_id: id })
      .populate('book_id', 'title')
      .populate('member_id', 'name')
      .sort({ issue_date: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch member issue records', error: error.message });
  }
});

// GET /issues/overdue -> Get books not returned after due date.
router.get('/issues/overdue', async (req, res) => {
  try {
    const today = new Date();
    const issues = await IssuedBook.find({
      return_date: null,
      due_date: { $lt: today },
    })
      .populate('book_id', 'title')
      .populate('member_id', 'name')
      .sort({ due_date: 1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch overdue books', error: error.message });
  }
});

// GET /issues/details -> Detailed issue records.
router.get('/issues/details', async (req, res) => {
  try {
    const issues = await IssuedBook.find()
      .populate('member_id', 'name')
      .populate('book_id', 'title')
      .populate('staff_id', 'name')
      .sort({ _id: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch issue details', error: error.message });
  }
});

// POST /issues -> Issue a book and reduce available copies.
router.post('/issues', async (req, res) => {
  try {
    const { book_id, member_id, staff_id, issue_date, due_date, return_date, status } = req.body;

    if (!book_id || !member_id || !issue_date) {
      return res.status(400).json({ message: 'book_id, member_id and issue_date are required' });
    }

    // Check if all referenced entities exist
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.available_copies <= 0) {
      return res.status(400).json({ message: 'No copies available for this book' });
    }

    const member = await Member.findById(member_id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (staff_id) {
      const staff = await Staff.findById(staff_id);
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }
    }

    const finalDueDate = due_date
      || new Date(new Date(issue_date).getTime() + 14 * 24 * 60 * 60 * 1000);

    // Create the issued book record
    const issuedBook = new IssuedBook({
      book_id,
      member_id,
      staff_id: staff_id || undefined,
      issue_date,
      due_date: finalDueDate,
      return_date: return_date || undefined,
      status: status || 'Issued',
    });

    const savedIssue = await issuedBook.save();

    // Decrease available copies
    await Book.findByIdAndUpdate(book_id, {
      available_copies: book.available_copies - 1,
    });

    res.status(201).json({
      message: 'Book issued successfully and available copies updated',
      issue_id: savedIssue._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to issue book', error: error.message });
  }
});

// PUT /issues/return/:id -> Return a book and increase available copies.
router.put('/issues/return/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { return_date } = req.body;
    const finalReturnDate = return_date || new Date();

    const issue = await IssuedBook.findById(id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    if (issue.return_date) {
      return res.status(400).json({ message: 'Book already returned for this issue record' });
    }

    const bookId = issue.book_id;
    const dueDate = issue.due_date;
    const fineAmount = dueDate && finalReturnDate > dueDate
      ? Math.max(0, Math.floor((new Date(finalReturnDate) - new Date(dueDate)) / (1000 * 60 * 60 * 24))) * 5
      : 0;

    // Update issue record
    await IssuedBook.findByIdAndUpdate(id, {
      return_date: finalReturnDate,
      fine_amount: fineAmount,
      status: 'Returned',
    });

    // Increase available copies
    const book = await Book.findById(bookId);
    if (book) {
      await Book.findByIdAndUpdate(bookId, {
        available_copies: book.available_copies + 1,
      });
    }

    res.json({ message: 'Book returned successfully and copies updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to return book', error: error.message });
  }
});

module.exports = router;
