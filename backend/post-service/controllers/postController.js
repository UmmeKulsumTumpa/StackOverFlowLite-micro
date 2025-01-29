const Post = require("../models/Post");
const axios = require("axios");
const minioClient = require("../utils/minioConfig");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const sanitize = require("sanitize-filename");
const moment = require("moment");

// Fetch all posts or exclude posts by the logged-in user
exports.getPosts = async (req, res) => {
    try {
        const { excludeUserId } = req.query; // Optional query parameter
        let filter = {};

        // If excludeUserId is provided, exclude posts by that user
        if (excludeUserId) {
            filter.author_id = { $ne: excludeUserId };
        }

        // Fetch posts based on the filter
        const posts = await Post.find(filter).sort({ createdAt: -1 });

        res.status(200).json({ success: true, posts });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, content, fileType, codeSnippet } = req.body;
        const userId = req.user?.id; // Ensure the user ID is attached to the request

        // Validate request
        if (!content && !req.file && !codeSnippet) {
            return res.status(400).json({
                message: "Content, file, or code snippet is required to create a post.",
            });
        }

        let fileUrl = null;
        let fileName = null;
        let codeSnippetUrl = null;

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
            fileUrl = `${protocol}://localhost:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${uniqueFileName}`;
            fileName = originalName;
        }

        // Handling code snippet if provided
        if (codeSnippet) {
            const snippetFileName = `${uuidv4()}.txt`; // Save code snippets as .txt files

            // Create a buffer from the code snippet text
            const buffer = Buffer.from(codeSnippet, 'utf-8');
            const metaData = {
                'Content-Type': 'text/plain',
            };

            // Upload the code snippet buffer to MinIO
            await minioClient.putObject(process.env.MINIO_BUCKET_NAME, snippetFileName, buffer, metaData);

            const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
            codeSnippetUrl = `${protocol}://localhost:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${snippetFileName}`;
        }

        // Create a new post object
        const newPost = new Post({
            title: title || "Untitled",
            content: content || "",
            author_id: userId,
            file_url: fileUrl,
            file_name: fileName,
            file_type: fileType,
            code_snippet_url: codeSnippetUrl,
        });

        // console.log("New Post:", newPost);

        // Save the post to the database
        await newPost.save();

        // Trigger a notification for other users
        try {
            const notificationMessage = `A new post titled "${newPost.title}" has been created.`;
            await axios.post(
                `http://gateway/api/notifications`,
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

        res.status(200).json({ success: true, posts: userPosts });
    } catch (err) {
        console.error("Error fetching user posts:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // console.log("Post:", post);
        
        res.status(200).json({ post });
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        res.status(500).json({ message: "Server error." });
    }
};
