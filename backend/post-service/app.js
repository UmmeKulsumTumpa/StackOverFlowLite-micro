const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Post Service: Connected to MongoDB'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => console.log(`Post Service running on port ${PORT}`));
