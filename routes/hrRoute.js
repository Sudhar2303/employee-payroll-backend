const express = require('express')
const router = express.Router()
const {getDepartmentViceCount,getAuthenticate,getAttendenceStatus,postNewEmployee,updateExistingEmployee} = require('../controllers/hrController')
const {getEmployeeDetails,getEmployeeCount,getGradeData} = require('../controllers/adminController')
const {hrVerify} = require('../middleware/hrVerify')

router.route('/getEmployee').get(hrVerify,getEmployeeDetails)
router.route('/addEmployee').get(hrVerify,postNewEmployee)
router.route('/updateEmployeeData').get(hrVerify,updateExistingEmployee)
router.route('/getGrade').get(hrVerify,getGradeData)

router.route('/getDepartmentViceCount').get(hrVerify,getDepartmentViceCount)
router.route('/getAttendenceStatus').get(getAttendenceStatus)
router.route('/employeeCount').get(getEmployeeCount)


router.route('/authenticate').get(hrVerify,getAuthenticate)

module.exports = router
