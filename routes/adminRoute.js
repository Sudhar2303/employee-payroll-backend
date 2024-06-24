const express = require('express')
const router = express.Router()
const {getEmployeeDetails,getTotalEmployeeSalary,postNewEmployee} = require('../controllers/adminController')
const {verify} = require('../middleware/verify')

router.route('/getEmployee').get(verify,getEmployeeDetails)
router.route('/addEmployee').post(verify,postNewEmployee)
router.route('/getTotalSalary').get(verify,getTotalEmployeeSalary)

module.exports = router
