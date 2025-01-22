const express = require("express");
const {
    getUserNotifications,
    markNotificationAsSeen,
    createNotification,
} = require("../controllers/notificationController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications for a user
router.get("/", verifyToken, getUserNotifications);

// Mark a specific notification as seen
router.put("/:notificationId/markAsSeen", verifyToken, markNotificationAsSeen);

// Create a notification
router.post("/", verifyToken, createNotification);

module.exports = router;
