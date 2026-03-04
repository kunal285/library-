const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// GET /books -> Fetch all books.
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find()
      .populate('category_id', 'category_name')
      .sort({ _id: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
});

// GET /stats/books -> Count total book records.
router.get('/stats/books', async (req, res) => {
  try {
    const total_books = await Book.countDocuments();
    res.json({ total_books });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books count', error: error.message });
  }
});

// GET /books/available -> Fetch books where at least 1 copy is available.
router.get('/books/available', async (req, res) => {
  try {
    const books = await Book.find({ available_copies: { $gt: 0 } }).sort({ title: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch available books', error: error.message });
  }
});

// POST /books -> Add a new book.
router.post('/books', async (req, res) => {
  try {
    const {
      title,
      author,
      genre,
      published_year,
      total_copies,
      available_copies,
      isbn,
      publisher,
      category_id,
    } = req.body;

    if (!title || !author || !genre || !published_year || available_copies === undefined) {
      return res.status(400).json({ message: 'All book fields are required' });
    }

    const finalTotalCopies =
      total_copies === undefined ? Number(available_copies) : Number(total_copies);

    const book = new Book({
      title,
      author,
      isbn: isbn || undefined,
      publisher: publisher || undefined,
      genre,
      published_year,
      total_copies: finalTotalCopies,
      available_copies,
      category_id: category_id || undefined,
    });

    const savedBook = await book.save();
    res.status(201).json({ message: 'Book added successfully', book_id: savedBook._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate ISBN is not allowed' });
    }
    res.status(500).json({ message: 'Failed to add book', error: error.message });
  }
});

// PUT /books/:id -> Update book details.
router.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      genre,
      published_year,
      total_copies,
      available_copies,
      isbn,
      publisher,
      category_id,
    } = req.body;

    if (!title || !author || !genre || !published_year || available_copies === undefined) {
      return res.status(400).json({ message: 'All book fields are required for update' });
    }

    const finalTotalCopies =
      total_copies === undefined ? Number(available_copies) : Number(total_copies);

    const book = await Book.findByIdAndUpdate(
      id,
      {
        title,
        author,
        isbn: isbn || undefined,
        publisher: publisher || undefined,
        genre,
        published_year,
        total_copies: finalTotalCopies,
        available_copies,
        category_id: category_id || undefined,
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate ISBN is not allowed' });
    }
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
});

// DELETE /books/:id -> Delete book by ID.
router.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
});

module.exports = router;
