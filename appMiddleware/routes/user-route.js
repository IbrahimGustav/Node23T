const userController = require('../controllers/user-controller')
const express = require('express')
const userAuth = require('../middlewares/user-auth')

const router = express.Router()

router.get('/', userController.getUser)
router.get('/:id', userAuth, userController.getUserByIndex)
module.exports = router