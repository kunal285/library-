const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const booksRoutes = require('./routes/books');
const membersRoutes = require('./routes/members');
const issuesRoutes = require('./routes/issues');
const categoriesRoutes = require('./routes/categories');
const staffRoutes = require('./routes/staff');
const reservationsRoutes = require('./routes/reservations');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Enable CORS for frontend requests.
app.use(cors());

// Parse JSON request bodies.
app.use(express.json());

// Health check route to verify API is running.
app.get('/', (req, res) => {
  res.json({ message: 'Library Management System API is running' });
});

// Mount feature routes.
app.use(booksRoutes);
app.use(membersRoutes);
app.use(issuesRoutes);
app.use(categoriesRoutes);
app.use(staffRoutes);
app.use(reservationsRoutes);

// Global fallback for undefined routes.
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler.
app.use((error, req, res, next) => {
  res.status(500).json({ message: 'Internal server error', error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
