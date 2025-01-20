const express = require("express");
const {
    getUserNotifications,
    markNotificationAsSeen,
    createNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// Get all notifications for a user
router.get("/", getUserNotifications);

// Mark a specific notification as seen
router.put("/:notificationId/markAsSeen", markNotificationAsSeen);

// Create a notification
router.post("/", createNotification);

module.exports = router;
