const db = require('../config/db')

const getAllUsers = async (params) => {
    const [rows] = await db.query('select * from users')
    return rows    
}
const getUserByID = async (id) =>{
    const [row] = await db.query('select *  from user where id=?',id)
    return row
}

module.exports = {getAllUsers, getUserByID, getUserByName, getUserByEmail}