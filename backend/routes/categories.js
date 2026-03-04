const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

// GET /categories -> Fetch all categories.
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ _id: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

// POST /categories -> Add a category.
router.post('/categories', async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: 'category_name is required' });
    }

    const category = new Category({ category_name });
    const savedCategory = await category.save();

    res.status(201).json({ message: 'Category added successfully', category_id: savedCategory._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Failed to add category', error: error.message });
  }
});

// DELETE /categories/:id -> Delete category by ID.
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
});

module.exports = router;
