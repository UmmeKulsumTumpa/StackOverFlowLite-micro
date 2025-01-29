const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            unique: true, // Ensure only one notification per post
        },
        message: {
            type: String,
            required: true,
        },
        seenBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }], // Users who have seen this notification
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
