const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB file size limit
});

const uploadMiddleware = upload.single("file"); // Handle single file uploads
module.exports = uploadMiddleware;
