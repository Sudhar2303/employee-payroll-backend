const mongoose = require('mongoose')

const gradeModel = mongoose.Schema(
    {
        gradeNo:
        {
            type : Number,
            required : true
        },
        basicPay :
        {
            type : Number,
            required : true
        },
        hra : 
        {
            type : Number,
            required : true
        },
        da :
        {
            type : Number,
            required : true
        },
        active :
        {
            type : Boolean,
            default :true
        }
    },
    {
        collection : 'employee_grade'
    }
)

module.exports = mongoose.model('employee_grade',gradeModel)