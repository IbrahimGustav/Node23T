const userController = require('../controllers/user-controller')
const express = require('express')
const router = express.Router()
const userAuth = require('../middlewares/user-auth')

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.post('/',userController.addUser)
router.put('/:id',userController.updateUserById)
router.delete('/:id', userAuth,userController.deleteUserById)

module.exports = router