const express = require('express')
const router = express.Router()
const {LoginExistingUser} = require('../controllers/loginController')

router.route('/').post(LoginExistingUser)

module.exports = router