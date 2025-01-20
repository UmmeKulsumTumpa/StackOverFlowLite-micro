const express = require("express");
const { getPosts, createPost, getUserPosts } = require("../controllers/postController");
const uploadMiddleware = require("../utils/uploadMiddleware");

const router = express.Router();

// Get all posts
router.get("/", getPosts);

// Create a new post
router.post("/", uploadMiddleware, createPost);

// Get posts by a specific user
router.get("/user/:userId", getUserPosts);

module.exports = router;
