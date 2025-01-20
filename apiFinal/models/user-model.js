const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'asfhilq2y9o47hajwy4r8q9yrf8ahbfsvc98';

// User Registration
const userRegistration = async (data) => {
    const { email, username, password } = data;

    if (!email || !username || !password) {
        return "Data is not valid";
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await db.query(
            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
            [email, username, hashedPassword]
        );

        return { id: result.insertId, hashedPassword };
    } catch (error) {
        console.error('Error during user registration:', error.message);
        throw new Error("User registration failed");
    }
};

// User Login
const userLogin = async (data) => {
    const { username, password } = data;

    if (!username || !password) {
        return "User data not found";
    }

    try {
        const query = "SELECT * FROM users WHERE username = ?";
        const [result] = await db.query(query, [username]);

        if (result.length === 0) {
            return { message: "Wrong username or password" };
        }

        const isPasswordValid = await bcrypt.compare(password, result[0].password);

        if (isPasswordValid) {
            const payload = {
                id: result[0].id,
                username: result[0].username,
                email: result[0].email
            };
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

            return {
                message: "Login successful",
                token
            };
        }

        return { message: "Wrong username or password" };
    } catch (error) {
        console.error('Error during user login:', error.message);
        throw new Error("User login failed");
    }
};

// Get All Users
const getAllUsers = async () => {
    try {
        const query = "SELECT * FROM users";
        const [result] = await db.query(query);
        return result;
    } catch (error) {
        console.error('Error fetching all users:', error.message);
        throw new Error("Failed to fetch users");
    }
};

module.exports = { userRegistration, userLogin, getAllUsers };
