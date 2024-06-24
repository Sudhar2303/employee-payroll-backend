const mongoose = require('mongoose')
const employee_details = require('./EmployeeDetailsModel')

const salaryDetailsModel = mongoose.Schema(
    {
        employeeID:
        {
            type: String,
            ref : 'employeeDetails',
            required : true,
            unique : true
        },
        perDaySalary :
        {
            type : Number,
            default:0
        },
        month :
        {
            type: String,
            required : true
        },
        workingDays :
        {
            type : Number,
            match: [/^[0-24]$/],
            required: true,
            default : 0
        },
        salary :
        {
            type : Number,
            default:0
        }
    },
    {
        collections : 'salaryDetails'
    }
)

module.exports = mongoose.model('salarydetails',salaryDetailsModel)
