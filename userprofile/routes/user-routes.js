const userController = require('../controllers/user-controller')
const express = require('express')
const router = express.Router()

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.post('/',userController.addUser)
router.post('/',userController.updateUser)

module.exports = router