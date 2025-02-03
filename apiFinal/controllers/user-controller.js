const userModel= require('../models/user-model');

const userRegistration = async (req, res) => {
    const data = req.body;
    try {
        const addUser = await userModel.userRegistration(data);
        if (addUser) {
            return res.status(200).json({ id: addUser.id, hash: addUser.hash });
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Registration failed" });
    }
};

const userLogin = async (req, res) => {
    const data = req.body;
    try {
        const response = await userModel.userLogin(data);
        if (response) {
            return res.json(response);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Login failed" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const response = await userModel.getAllUsers();
        res.json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};

const updateUser = async (req, res) => {
    const userId = req.user?.id;
    const { username, email, password } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    try {
        const updatedUser = await userModel.updateUser(userId, { username, email, password });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error.message);
        return res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    const authUserId = req.user.id;

    if (parseInt(userId, 10) !== authUserId) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own account' });
    }

    try {
        const isDeleted = await userModel.deleteUser(userId);
        if (!isDeleted) {
            return res.status(404).json({ message: `No user found with ID: ${userId}` });
        }
        return res.status(200).json({ message: `User with ID: ${userId} has been deleted successfully.` });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        return res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};

module.exports = { 
    userRegistration, 
    userLogin, 
    getAllUsers, 
    updateUser, 
    deleteUser 
};