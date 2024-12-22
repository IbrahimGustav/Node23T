const db = require('../config/db')

const getAllUsers = async (params) => {
    const [rows] = await db.query('select * from users')
    return rows    
}
const getUserById = async (id) =>{
    const [row] = await db.query('select *  from users where id=?',id)
    return row
}

const addUser = async (user) => {
    const {name, email, phone} = user
    const [result] = await db.query('insert into users (name,email,phone) values(?,?,?)', [name, email, phone])
    return result.insertId    
}

const updateUserById = async (id, user) => {
    const { name, email, phone } = user
    const [result] = await db.query('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone, id])
    return result.affectedRows > 0
}

const deleteUserById = async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id])
    return result.affectedRows > 0
}

module.exports = {getAllUsers, getUserById, addUser, updateUserById, deleteUserById}