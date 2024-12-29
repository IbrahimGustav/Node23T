const express = require('express')
const userController = require('../controllers/user-controller')
const router = express.Router()

router.get('/tasks', userController.getAllTasks)
router.get('/tasks/:id', userController.getTaskById)
router.post('/tasks', userController.addTask)
router.put('/tasks/:id', userController.updateTaskById)
router.delete('/tasks/:id', userController.deleteTaskById)

module.exports = router