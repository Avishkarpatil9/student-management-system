require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const studentRoutes = require('./routes/student.routes');
const errorHandler  = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Student Management System API is running' });
});

// Routes
app.use('/api/students', studentRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});