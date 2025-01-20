const Post = require("../models/Post");
const axios = require("axios");
const minioClient = require("../utils/minioConfig");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const sanitize = require("sanitize-filename");
const moment = require("moment");

// Fetch all posts or filter by user ID
exports.getPosts = async (req, res) => {
    try {
        const { userId } = req.query; // Optional userId for filtering
        let posts;

        if (userId) {
            // Exclude posts created by the requesting user
            posts = await Post.find({ author_id: { $ne: userId } }).sort({
                createdAt: -1,
            });
        } else {
            // Fetch all posts
            posts = await Post.find().sort({ createdAt: -1 });
        }

        res.status(200).json({ success: true, posts });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, content, codeSnippet } = req.body;
        const userId = req.user?.id; // Ensure the user ID is attached to the request

        // Validate request
        if (!content && !req.file && !codeSnippet) {
            return res.status(400).json({
                message: "Content, file, or code snippet is required to create a post.",
            });
        }

        let fileUrl = null;
        let fileName = null;

        // If a file is uploaded, handle it
        if (req.file) {
            const originalName = sanitize(req.file.originalname);
            const fileExtension = path.extname(originalName);
            const uniqueFileName = `${uuidv4()}-${moment().format("HHmmss")}${fileExtension}`;

            const metaData = { "Content-Type": req.file.mimetype };

            // Upload file to MinIO
            await minioClient.putObject(
                process.env.MINIO_BUCKET_NAME,
                uniqueFileName,
                req.file.buffer,
                metaData
            );

            const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
            fileUrl = `${protocol}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${uniqueFileName}`;
            fileName = originalName;
        }

        // Create a new post object
        const newPost = new Post({
            title: title || "Untitled",
            content: content || "",
            author_id: userId,
            file_url: fileUrl,
            file_name: fileName,
        });

        console.log("New Post:", newPost);

        // Save the post to the database
        await newPost.save();

        // Trigger a notification for other users
        try {
            const notificationMessage = `A new post titled "${newPost.title}" has been created.`;
            await axios.post(
                `http://notification-service:8003/api/notifications`,
                { postId: newPost._id, message: notificationMessage },
                {
                    headers: {
                        Authorization: req.headers.authorization,
                    },
                }
            );
        } catch (error) {
            console.error("Error sending notification:", error.message);
        }

        res.status(201).json({
            success: true,
            message: "Post created successfully.",
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Fetch posts by a specific user
exports.getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find posts by user ID
        const userPosts = await Post.find({ author_id: userId }).sort({
            createdAt: -1,
        });

        if (!userPosts.length) {
            return res.status(404).json({ success: false, message: "No posts found for this user." });
        }

        res.status(200).json({ success: true, posts: userPosts });
    } catch (err) {
        console.error("Error fetching user posts:", err);
        res.status(500).json({ error: "Server error" });
    }
};
