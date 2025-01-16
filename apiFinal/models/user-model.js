const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'asfhilq2y9o47hajwy4r8q9yrf8ahbfsvc98'
const userRegistration = async (data) => {
    const { email, username, password } = data;

    if (!email || !username || !password) {
        return "Data is not valid";
    }

    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const [result] = await db.query(
            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
            [email, username, hash]
        );

        return { id: result.insertId, hash: hash };
    } catch (error) {
        console.error(error);
        throw new Error("User registration failed");
    }
};

const userLogin = async (data) => {
    const {username, password} = data
    if(!username || !password){
        return "User data not found"
    }
    try {
        const query = "select * from users where username=?"
        const [result] = await db.query(query,[username])
        const isLogin = await bcrypt.compare(password,result[0].password)
        if (isLogin){
            const payload = {
                id:result[0].id,
                username:result[0].username,
                email:result[0].email
            }
            const token = jwt.sign(payload, SECRET_KEY,{expiresIn:"1h"})
            return({
                message : "Login Succesful",
                token : token
            })
        }
    return ({
        message: "Wrong username or password"
    })
    } catch (error) {
        console.log(error);
        
    }
}
const getAlluser = async () => {
    try {
        const query = "select * from users"
        const [result] =  await db.query(query)
        return result
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = { userRegistration, userLogin, getAlluser };
