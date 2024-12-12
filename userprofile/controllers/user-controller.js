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

const updateUser = async (req,res) => {
    try {
        const updateUserId = await userModel.updateUser(req.body)
        req.status(200).json({id:updateUserId,...req.body})
    } catch (error) {
        res.status(500).json({message:'Error Update Data', error})
        console.log(error);
        
    }
}

module.exports = {getAllUsers, getUserById, addUser, updateUser}