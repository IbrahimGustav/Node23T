const db = require('../config/db')

const getAllUsers = async (params) => {
    const [rows] = await db.query('select * from users')
    return rows    
}
const getUserByID = async (id) =>{
    const [row] = await db.query('select *  from user where id=?',id)
    return row
}
const getUserByName = async (name) =>{
    const [row] = await db.query('select * from user where name=?', name)
    return row
}
const getUserByEmail = async (email) =>{
    const [row] = await db.query('select * from user where email=?', email)
}

module.exports = {getAllUsers, getUserByID, getUserByName, getUserByEmail}