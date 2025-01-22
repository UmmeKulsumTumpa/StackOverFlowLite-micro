const express = require("express");
const { getPosts, createPost, getUserPosts } = require("../controllers/postController");
const uploadMiddleware = require("../utils/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get all posts
router.get("/", verifyToken, getPosts);

// Create a new post
router.post("/", verifyToken, uploadMiddleware, createPost);

// Get posts by a specific user
router.get("/user/:userId", verifyToken, getUserPosts);

module.exports = router;
