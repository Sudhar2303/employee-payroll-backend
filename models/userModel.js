const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userModel = mongoose.Schema(
    {
        firstName : 
        {
            type : String
        },
        emailID :
        {
            type : String,
            required : true,
            unique : true 
        },
        password :
        {
            type: String,
            required : true
        },
        role :
        {
            type: String,
            enum : ['admin','hr','employee'],
            default : 'employee'
        }
    },
    {
        collections : 'userLogin'
    }
)

userModel.pre('save', function (next) {
    const user = this

    if (!user.isModified('password')) return next()
    bcrypt.genSalt(10, (error, salt) => {
        if (error) return next(error)

        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) return next(error)

            user.password = hash
            next()
        })
    })
})


module.exports = mongoose.model('userLogin',userModel)

