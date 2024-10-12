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
        month :
        {
            type: String,
            required : true
        },
        year :
        {
            type: Number,
            required: true,
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
        },
        salarystatus :
        {
            type : String,
            enum :["paid","unpaid"]
        }
    },
    {
        collections : 'salaryDetails'
    }
)

module.exports = mongoose.model('salarydetails',salaryDetailsModel)
