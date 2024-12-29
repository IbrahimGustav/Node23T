const userModel = require('../models/user-model')

const getAllTasks = async (req, res) => {
    try {
        const tasks = await userModel.getAllTasks()
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No Tasks Found' })
        }
        res.status(200).json(tasks)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error Fetching Tasks', error })
    }
}

const getTaskById = async (req, res) => {
    try {
        const task = await userModel.getTaskById(req.params.id)
        if (!task) {
            return res.status(404).json({ message: 'Task Not Found' })
        }
        res.status(200).json(task)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error Fetching Task', error })
    }
}

const addTask = async (req, res) => {
    try {
        const newTaskId = await userModel.addTask(req.body)
        res.status(201).json({ id: newTaskId, ...req.body })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error Adding Task', error })
    }
}

const updateTaskById = async (req, res) => {
    try {
        const updated = await userModel.updateTaskById(req.params.id, req.body)
        if (!updated) {
            return res.status(404).json({ message: 'Task Not Found' })
        }
        res.status(200).json({ message: 'Task Updated Successfully', id: req.params.id, ...req.body })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error Updating Task', error })
    }
}

const deleteTaskById = async (req, res) => {
    try {
        const deleted = await userModel.deleteTaskById(req.params.id)
        if (!deleted) {
            return res.status(404).json({ message: 'Task Not Found' })
        }
        res.status(200).json({ message: 'Task Deleted Successfully', id: req.params.id })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error Deleting Task', error })
    }
}

module.exports = { getAllTasks, getTaskById, addTask, updateTaskById, deleteTaskById }