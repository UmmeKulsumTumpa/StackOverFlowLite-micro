const express = require('express');
const { signup, signin } = require('../controllers/authController');

const router = express.Router();

// User signup route
router.post('/signup', signup);

// User signin route
router.post('/signin', signin);

module.exports = router;
