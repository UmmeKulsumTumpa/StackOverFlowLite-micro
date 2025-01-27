const express = require("express");
const { getPosts, createPost, getUserPosts, getPostById } = require("../controllers/postController");
const uploadMiddleware = require("../utils/uploadMiddleware");
const {verifyToken, validateApiKey} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all posts
router.get("/", getPosts);

// Create a new post
router.post("/", verifyToken, uploadMiddleware, createPost);

// Get posts by a specific user
router.get("/user/:userId", verifyToken, getUserPosts);

// Get post by ID
router.get("/:id", verifyToken, getPostById);

module.exports = router;
