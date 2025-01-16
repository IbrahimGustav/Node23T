const userModel = require('../models/user-model')
const userRegistration = async (req,res) => {
    const data = req.body
    try {
        const addUser = await userModel.userRegistration(data)
        if(addUser){
            return res.status(200).json({id:addUser.id,hash:addUser.hash})
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"Registration failed"})
    }
}

const userLogin = async (req,res) => {
    const data = req.body
    try {
        const response = await userModel.userLogin(data)
        if(response){
            res.json(response)
    }
    } catch (error) {
        console.log(error);
        
    }

            
        }
const getAlluser = async (req,res) => {
    try {
        const response = await userModel.getAlluser()
        res.json(response)
    } catch (error) {
        console.log(error);
        
    }
}

module.exports= {userRegistration, userLogin, getAlluser}