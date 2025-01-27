const express = require('express');
const { signup, signin, getUserEmail, getAllUsers } = require('../controllers/authController');
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// User signup route
router.post('/signup', signup);

// User signin route
router.post('/signin', signin);

// Route to get user email by ID
router.get('/:id', getUserEmail);

// Route to get all users
router.get("/", verifyToken, getAllUsers);

module.exports = router;
