const express = require('express')
const router = express.Router()
const {getEmployeeDetails,getTotalEmployeeSalary,postNewEmployee,getAuthenticate} = require('../controllers/adminController')
const {adminVerify} = require('../middleware/adminVerify')

router.route('/getEmployee').get(adminVerify,getEmployeeDetails)
router.route('/addEmployee').post(adminVerify,postNewEmployee)
router.route('/getTotalSalary').get(adminVerify,getTotalEmployeeSalary)
router.route('/authenticate').get(adminVerify,getAuthenticate)

module.exports = router
