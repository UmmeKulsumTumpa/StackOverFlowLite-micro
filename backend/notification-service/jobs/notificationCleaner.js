const cron = require('node-cron');
const Notification = require('../models/Notification');

// Time threshold (e.g., delete notifications older than 7 days)
const DELETE_THRESHOLD_DAYS = 1;
const DELETE_THRESHOLD_MS = DELETE_THRESHOLD_DAYS * 60 * 1000;

// Schedule the cleanup job
const cleanOldNotifications = () => {
    cron.schedule('*/1 * * * *', async () => { // Runs every day at midnight
        try {
            const timeThreshold = new Date(Date.now() - DELETE_THRESHOLD_MS);
            const result = await Notification.deleteMany({ createdAt: { $lt: timeThreshold } });

            // console.log(`[Notification Cleaner] Deleted ${result.deletedCount} old notifications.`);
        } catch (error) {
            console.error("[Notification Cleaner] Error cleaning old notifications:", error);
        }
    }, {
        scheduled: true,
        timezone: "UTC"
    });
};

module.exports = cleanOldNotifications;


// How Cron Expressions Work
// Expression	Runs Every
// */30 * * * * *	30 seconds
// */1 * * * *	1 minute
// 0 * * * * *	Every minute at 0 seconds
// 0 0 * * *	Once daily at midnight