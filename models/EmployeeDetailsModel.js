const mongoose = require('mongoose')
const employeeData = require('../data/initialEmployeeData')

const employeeDetailsModel = mongoose.Schema(
    {
        employeeName:
        {
            type : String,
            required : true
        },
        employeeID:
        {
            type : String,
            required : true,
            unique : true
        },
        role:
        {
            type : String,
            enum : ["hr","Developer", "Manager", "Designer", "Tester"],
            required : true
        },
        gender :
        {
            type : String,
            enum :["male","female"],
            required : true
        },
        grade :
        {
            type: Number,
            required : true,
            match: [/^[1-5]$/],
            default : 5
        },
        basicPay :
        {
            type: Number,
            required : true
        },
        status :
        {
            type:String,
            enum:['online','offline'],
            required:true,
            default:'offline'
        },
        salaryStatus :
        {
            type: String,
            enum: ["paid","unpaid"],
            required : true,
            default:"unpaid"
        }
    },
    {
        collections : 'employeeDetails'
    }
)

module.exports = mongoose.model('employeeDetails',employeeDetailsModel)