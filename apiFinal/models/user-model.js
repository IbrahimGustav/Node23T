const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'asfhilq2y9o47hajwy4r8q9yrf8ahbfsvc98';

const userRegistration = async (data) => {
    const { email, username, password } = data;

    if (!email || !username || !password) {
        throw new Error("Data is not valid");
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await db.query(
            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
            [email, username, hashedPassword]
        );

        return { id: result.insertId, hash: hashedPassword };
    } catch (error) {
        console.error('Error during user registration:', error.message);
        throw new Error("User registration failed");
    }
};

const userLogin = async (data) => {
    const { username, password } = data;

    if (!username || !password) {
        throw new Error("User data not found");
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
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });

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

const updateUser = async (userId, { username, email, password }) => {
    try {
        const fieldsToUpdate = [];
        const values = [];

        if (username) {
            fieldsToUpdate.push('username = ?');
            values.push(username);
        }

        if (email) {
            fieldsToUpdate.push('email = ?');
            values.push(email);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            fieldsToUpdate.push('password = ?');
            values.push(hashedPassword);
        }

        if (fieldsToUpdate.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(userId);
        const query = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?;`;
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return null;
        }

        return result;
    } catch (error) {
        console.error('Error updating user:', error.message);
        throw new Error("Failed to update user");
    }
};

const deleteUser = async (userId) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting user:', error.message);
        throw new Error("Failed to delete user");
    }
};

module.exports = { 
    userRegistration, 
    userLogin, 
    getAllUsers, 
    updateUser, 
    deleteUser 
};