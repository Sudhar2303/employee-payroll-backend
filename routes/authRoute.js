const express = require('express')
const router = express.Router()
const {loginUser,logoutUser} = require('../controllers/authController')

router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
module.exports = router