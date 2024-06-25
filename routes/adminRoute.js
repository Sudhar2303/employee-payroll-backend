const express = require('express')
const router = express.Router()
const {getEmployeeDetails,getTotalEmployeeSalary,postNewEmployee,getAuthenticate} = require('../controllers/adminController')
const {verify} = require('../middleware/verify')

router.route('/getEmployee').get(verify,getEmployeeDetails)
router.route('/addEmployee').post(verify,postNewEmployee)
router.route('/getTotalSalary').get(verify,getTotalEmployeeSalary)
router.route('/authenticate').get(verify,getAuthenticate)

module.exports = router
