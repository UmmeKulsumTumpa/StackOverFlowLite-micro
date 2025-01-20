const Notification = require('../models/Notification');
const User = require('../models/User');

// Get notifications for a specific user
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // Extract the user ID from the request (e.g., via middleware)
        console.log('Fetching notifications for user:', userId);

        // Fetch notifications, populate postId for more details, and sort by creation time (most recent first)
        const notifications = await Notification.find({ recipient: userId })
            .populate('postId')
            .sort({ createdAt: -1 });

        console.log('Notifications fetched:', notifications);

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Mark a specific notification as seen
exports.markNotificationAsSeen = async (req, res) => {
    try {
        const { notificationId } = req.params; // Get the notification ID from the request parameters
        const userId = req.user.id; // Get the current user ID

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

        // Find all users except the sender
        const users = await User.find({ _id: { $ne: senderId } }); 
        if (!users.length) {
            return res.status(404).json({ success: false, message: 'No users to notify.' });
        }

        // Map users to create notification objects
        const notifications = users.map(user => ({
            recipient: user._id,
            postId,
            message,
            isSeen: false,
        }));

        // Insert notifications into the database
        const createdNotifications = await Notification.insertMany(notifications);

        res.status(201).json({
            success: true,
            message: 'Notifications created successfully.',
            notifications: createdNotifications,
        });
    } catch (error) {
        console.error('Error creating notifications:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
