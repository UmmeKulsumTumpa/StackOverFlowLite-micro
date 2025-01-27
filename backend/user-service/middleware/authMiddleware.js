const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract JWT from Authorization header

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = decoded;  // Attach the decoded token (user info) to the request
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = verifyToken;
