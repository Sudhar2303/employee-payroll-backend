const mongoose = require('mongoose')

const processModel = mongoose.Schema(
    {
        employeeID:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employeeDetails',
            required : true
        },
        gradeNo :
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'employee_grade',
            required : true,
        },
        basicPay :
        {
            type : Number,
            required : true
        },
        salary :
        {
            type : Number,
            required : true,
        },
        totalWorkingHours :
        {
            type : Number,
            required : true
        },
        active :
        {
            type : Boolean,
            default : true
        },
        date :
        {
            type : Date,
            default: Date.now 
        },
        approvalStatus :
        {
            type : String,
            enum : ["approved","pending"],
            default: "pending"
        }
    },
    {
        collection : 'salary_process'
    }
)
module.exports = mongoose.model('salary_process',processModel)