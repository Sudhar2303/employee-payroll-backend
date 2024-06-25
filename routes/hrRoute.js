const express = require('express')
const router = express.Router()
const {getAttendedHoursData,postAttendedHours,getTotalEmployeeSalary,getAuthenticate} = require('../controllers/hrController')
const {verify} = require('../middleware/verify')

router.route('/getAllEmployee').get(verify,getAttendedHoursData)
router.route('/updateAttendence').post(verify,postAttendedHours)
router.route('/getTotalSalary').get(verify,getTotalEmployeeSalary)
router.route('/authenticate').get(verify,getAuthenticate)

module.exports = router
