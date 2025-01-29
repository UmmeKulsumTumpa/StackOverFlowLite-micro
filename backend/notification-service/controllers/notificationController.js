const Notification = require('../models/Notification');
const axios = require("axios");
const API_KEY = process.env.POST_SERVICE_API_KEY;

exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("Fetching notifications for user:", userId);

        const notifications = await Notification.find().sort({ createdAt: -1 });

        // Format response to include seen status for the requesting user
        const notificationsWithSeenStatus = notifications.map(notification => ({
            ...notification._doc,
            isSeen: notification.seenBy.includes(userId), // Check if the user has seen it
        }));

        res.status(200).json({ success: true, notifications: notificationsWithSeenStatus });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error." });
    }
};


exports.markNotificationAsSeen = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user?.id;

        // Find notification and update seenBy array
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId },
            { $addToSet: { seenBy: userId } }, // Prevent duplicate entries
            { new: true }
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


exports.createNotification = async (req, res) => {
    try {
        const { postId, message } = req.body;
        const senderId = req.user?.id; // Get the sender ID (current user)

        // Check if a notification for this post already exists
        let existingNotification = await Notification.findOne({ postId });

        if (existingNotification) {
            return res.status(200).json({
                success: true,
                message: "Notification already exists for this post.",
                notification: existingNotification,
            });
        }

        // Create a new notification (Only one per post)
        const newNotification = new Notification({
            postId,
            message,
            seenBy: [senderId], // Initially, no one has seen it
        });

        await newNotification.save();

        res.status(201).json({
            success: true,
            message: "Notification created successfully.",
            notification: newNotification,
        });
    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({ message: "Server error." });
    }
};

