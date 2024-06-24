const mongoose = require('mongoose')
const employee_details = require('./EmployeeDetailsModel')

const salaryDetailsModel = mongoose.Schema(
    {
        employeeID:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'employeeDetails',
            required : true,
            unique : true
        },
        employeeName :
        {
            type : String
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
