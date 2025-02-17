const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const notificationRoutes = require("./routes/notificationRoutes");
const cleanOldNotifications = require('./jobs/notificationCleaner');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notifications", notificationRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Notification Service: Connected to MongoDB");
        
        cleanOldNotifications();
    })
    .catch((err) => console.error(err));

// Start the server
const PORT = process.env.PORT || 8003;
app.listen(PORT, () =>
    console.log(`Notification Service running on port ${PORT}`)
);
