const SECRET_KEY = 'asfhilq2y9o47hajwy4r8q9yrf8ahbfsvc98';
const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(400).json({ message: "Access Denied" });
    }

    try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user;
        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports = userAuth;
