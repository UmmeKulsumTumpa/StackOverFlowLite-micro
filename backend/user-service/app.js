const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('User Service: Connected to MongoDB'))
    .catch(err => console.error(err));

// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
