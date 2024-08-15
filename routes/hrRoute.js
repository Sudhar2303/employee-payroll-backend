const express = require('express')
const router = express.Router()
const {getAttendedHoursData,postAttendedHours,getTotalEmployeeSalary,getAuthenticate} = require('../controllers/hrController')
const {hrVerify} = require('../middleware/hrVerify')

router.route('/getAllEmployee').get(hrVerify,getAttendedHoursData)
router.route('/updateAttendence').post(hrVerify,postAttendedHours)
router.route('/getTotalSalary').get(hrVerify,getTotalEmployeeSalary)
router.route('/authenticate').get(hrVerify,getAuthenticate)

module.exports = router
