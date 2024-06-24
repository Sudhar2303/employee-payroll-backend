const express = require('express')
const router = express.Router()
const {getAttendedHoursData,postAttendedHours,getTotalEmployeeSalary} = require('../controllers/hrController')
const {verify} = require('../middleware/verify')

router.route('/getAllEmployee').get(verify,getAttendedHoursData)
router.route('/updateAttendence').post(verify,postAttendedHours)
router.route('/getTotalSalary').get(verify,getTotalEmployeeSalary)

module.exports = router
