const mongoose = require('mongoose')

const employeeDetailsModel = mongoose.Schema(
    {
        employeeID:
        {
            type : String,
            required : true,
            unique : true
        },
        employeeName:
        {
            type : String,
            required : true
        },
        role:
        {
            type : String,
            enum : ["hr","developer", "manager", "designer", "tester"],
            required : true
        },
        gender :
        {
            type : String,
            enum :["male","female"],
            required : true
        },
        emailID :
        {
            type :String,
            required :  true,
            unique : true
        },
        status :
        {
            type:String,
            enum:['online','offline'],
            required:true,
            default:'offline'
        },
        approvalStatus :
        {
            type: String,
            enum: ["approved","pending"],
            required : true,
            default:"pending"
        }
    },
    {
        collection : 'employeeDetails'
    }
)

module.exports = mongoose.model('employeeDetails',employeeDetailsModel)