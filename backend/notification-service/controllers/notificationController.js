const Notification = require('../models/Notification');
const axios = require("axios");
const API_KEY = process.env.POST_SERVICE_API_KEY;

exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("Fetching notifications for user:", userId);

        const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });

        const notificationsWithPostDetails = await Promise.all(
            notifications.map(async (notification) => {
                try {
                    // const postResponse = await axios.get(
                    //     `http://localhost:8002/api/posts/${notification.postId}`,
                    //     {
                    //         headers: {
                    //             "x-api-key": API_KEY,
                    //         },
                    //     }
                    // );

                    const postResponse = await axios.get(
                        `http://localhost:8002/api/posts/${notification.postId}`,
                        {
                            headers: {
                                Authorization: req.headers.authorization, // Forward user's token
                            },
                        }
                    );
                    // console.log("Post response:", postResponse.data);
                    

                    return {
                        ...notification._doc,
                        postDetails: postResponse.data.post,
                    };
                } catch (error) {
                    console.error(`Error fetching post details for postId: ${notification.postId}`, error.message);
                    return {
                        ...notification._doc,
                        postDetails: null,
                    };
                }
            })
        );

        res.status(200).json({ success: true, notifications: notificationsWithPostDetails });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Mark a specific notification as seen
exports.markNotificationAsSeen = async (req, res) => {
    try {
        const { notificationId } = req.params; // Get the notification ID from the request parameters
        const userId = req.user?.id; // Get the current user ID

        // Find and update the specific notification to mark it as "seen"
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { isSeen: true },
            { new: true } // Return the updated notification
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        res.status(200).json({ success: true, notification });
    } catch (error) {
        console.error('Error marking notification as seen:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Create notifications for multiple users
exports.createNotification = async (req, res) => {
    try {
        const { postId, message } = req.body; // Extract postId and message from the request body
        const senderId = req.user.id; // Get the sender ID (current user)

        // Fetch all users from the user-service
        const userServiceUrl = "http://localhost:8001/api/auth"; // Replace with actual URL
        const response = await axios.get(userServiceUrl, {
            headers: { Authorization: req.headers.authorization }, // Pass token for authentication
        });

        const allUsers = response.data.users;

        // Exclude the sender from the list of users
        const usersToNotify = allUsers.filter(user => user._id !== senderId);

        if (!usersToNotify.length) {
            return res.status(404).json({ success: false, message: "No users to notify." });
        }

        // Create notification objects for the users to notify
        const notifications = usersToNotify.map(user => ({
            recipient: user._id,
            postId,
            message,
            isSeen: false,
        }));

        // Insert notifications into the database
        const createdNotifications = await Notification.insertMany(notifications);

        res.status(201).json({
            success: true,
            message: "Notifications created successfully.",
            notifications: createdNotifications,
        });
    } catch (error) {
        console.error("Error creating notifications:", error);
        res.status(500).json({ message: "Server error." });
    }
};
