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
            enum : ["Developer", "Manager", "Designer", "Tester"],
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
        }
    },
    {
        collections : 'employeeDetails'
    }
)

module.exports = mongoose.model('employeeDetails',employeeDetailsModel)