const db = require('../config/db')

const getAllTasks = async () => {
    const [rows] = await db.query('SELECT * FROM tasks')
    return rows
}

const getTaskById = async (id) => {
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id])
    return rows[0]
}

const addTask = async (task) => {
    const { date, task: taskName, time } = task
    const [result] = await db.query('INSERT INTO tasks (date, task, time) VALUES (?, ?, ?)', [date, taskName, time])
    return result.insertId
}

const updateTaskById = async (id, task) => {
    const { date, task: taskName, time } = task
    const [result] = await db.query('UPDATE tasks SET date = ?, task = ?, time = ? WHERE id = ?', [date, taskName, time, id])
    return result.affectedRows > 0
}

const deleteTaskById = async (id) => {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id])
    return result.affectedRows > 0
}

module.exports = { getAllTasks, getTaskById, addTask, updateTaskById, deleteTaskById }