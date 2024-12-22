const userModel = require('../models/user-model')

const getUser = (req,res)=>{
    try {
        const users = userModel.getUser()
        if(users.length==0){
            res.status(200).json({message:'Empty Data User'})
        }
        else{
            res.status(200).json(users)
        }
    } catch (error) {
        console.log(error);
    }
}

const getUserByIndex = (req,res)=>{
    try {
        const user = userModel.getUserByIndex(req.params.id)
        res.json(user)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {getUser, getUserByIndex}
