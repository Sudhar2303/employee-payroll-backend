const express = require('express')
const router = express.Router()
const {getDepartmentViceCount,getTotalEmployeeSalary,getAuthenticate,getAttendenceStatus} = require('../controllers/hrController')
const {getEmployeeDetails,updateExistingEmployee,postNewEmployee,getEmployeeCount} = require('../controllers/adminController')
const {hrVerify} = require('../middleware/hrVerify')

router.route('/getAllEmployee').get(hrVerify,getEmployeeDetails)
router.route('/addNewEmployee').get(hrVerify,postNewEmployee)
router.route('/updateEmployeeData').get(hrVerify,updateExistingEmployee)
router.route('/getDepartmentViceCount').get(hrVerify,getDepartmentViceCount)
router.route('/getAttendenceStatus').get(getAttendenceStatus)
router.route('/employeeCount').get(getEmployeeCount)

router.route('/getTotalSalary').get(hrVerify,getTotalEmployeeSalary)
router.route('/authenticate').get(hrVerify,getAuthenticate)

module.exports = router
