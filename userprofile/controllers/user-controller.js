const userModel = require('../models/user-model')

const getAllUsers = async (req,res) => {
    try {
        const user = await userModel.getAllUsers()
        if(!user) res.json({message:'User Not Found'})
        res.json(user)
    } catch (error) {
        console.log(error);
        res.status(500),json({message: 'Error Get All Users'})
    }    
}

const getUserById = async (req,res) => {
    try {
        const user = await userModel.getUserById(req.params.id)
        res.json(user)
    } catch (error) {
        console.log(error)
        res.json({message:'Error'})
    }
}

const addUser = async (req, res) => {
    try {
        const newUserId = await userModel.addUser(req.body)
        req.status(200).json({id:newUserId,...req.body})
    } catch (error) {
        res.status(500).json({message:'Error Insert Data', error})
        console.log(error);
    }
}

const updateUser = async (req, res) => {
    try {
        const updated = await userModel.updateUser(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'User Not Found' });
        res.status(200).json({ message: 'User Updated Successfully', id: req.params.id, ...req.body });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error Update Data', error });
    }
}

const deleteUser = async (req, res) => {
    try {
        const deleted = await userModel.deleteUser(req.params.index);
        if (!deleted) return res.status(404).json({ message: 'User Not Found' });
        res.status(200).json({ message: 'User Deleted Successfully', index: req.params.index });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error Delete Data', error });
    }
}

module.exports = {getAllUsers, getUserById, addUser, updateUser, deleteUser}