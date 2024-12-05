const db = require('../config/db')

const getAllUsers = async (params) => {
    const [rows] = await db.query('select * from users')
    return rows    
}
const getUserById = async (id) =>{
    const [row] = await db.query('select *  from users where id=?',id)
    return row
}

module.exports = {getAllUsers, getUserById}