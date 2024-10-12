const express = require('express')
const router = express.Router()
const {getEmployeeDetails,getTotalEmployeeSalary,postNewEmployee,getAuthenticate,updateExistingEmployee,deleteEmployeeData,getEmployeeCount} = require('../controllers/adminController')
const {getDepartmentViceCount} = require('../controllers/hrController')
const {adminVerify} = require('../middleware/adminVerify')

router.route('/getEmployee').get(adminVerify,getEmployeeDetails)
router.route('/addEmployee').post(adminVerify,postNewEmployee)
router.route('/updateEmployeeData').post(adminVerify,updateExistingEmployee)
router.route('/deleteEmployeeData').delete(adminVerify,deleteEmployeeData)
router.route('/employeeCount').get(getEmployeeCount)
router.route('/getDepartmentViceCount').get(getDepartmentViceCount)

router.route('/getTotalSalary').get(adminVerify,getTotalEmployeeSalary)
router.route('/authenticate').get(adminVerify,getAuthenticate)

module.exports = router
