const express = require('express')
const router = express.Router()
const {getEmployeeDetails,postNewEmployee,getAuthenticate,calculateAndUpdateSalaries
    ,updateExistingEmployee,deleteEmployeeData,getGradeData,updateGrade,addNewGrade,
    getEmployeeCount,updatePendingApproval, getPendingRequest, updateSalaryStatus,
    totalSalary,countSalaryStatus}  = require('../controllers/adminController')
const {getDepartmentViceCount} = require('../controllers/hrController')
const {adminVerify} = require('../middleware/adminVerify')

router.route('/getEmployee').get(adminVerify,getEmployeeDetails)
router.route('/addEmployee').post(adminVerify,postNewEmployee)
router.route('/updateEmployeeData').post(adminVerify,updateExistingEmployee)
router.route('/deleteEmployeeData').delete(adminVerify,deleteEmployeeData)
router.route('/employeeCount').get(getEmployeeCount)
router.route('/getDepartmentViceCount').get(getDepartmentViceCount)
router.route('/getGrade').get(adminVerify,getGradeData)
router.route('/addGrade').post(adminVerify,addNewGrade)
router.route('/updateGrade').post(adminVerify,updateGrade)
router.route('/salary').get(adminVerify,calculateAndUpdateSalaries)
router.route('/pendingRequest').get(adminVerify,getPendingRequest)
router.route('/updateStatus').post(adminVerify,updatePendingApproval)
router.route('/totalSalary').get(adminVerify,totalSalary)
router.route('/updateSalaryStatus').post(adminVerify,updateSalaryStatus)
router.route('/countSalaryStatus').get(adminVerify,countSalaryStatus)
router.route('/authenticate').get(adminVerify,getAuthenticate)

module.exports = router
