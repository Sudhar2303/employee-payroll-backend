const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const JWT_SECRET = process.env.JWT_SECRET
const adminVerify = async(request,response,next)=>
{
    const token = request.cookies
    if (token.token != undefined)
    {
        const decoded = jwt.verify(token.token,JWT_SECRET)
        const userData = await userModel.findOne({emailID : decoded})
        if(userData)
        {
            if(userData.role == 'admin')
                next()
        }
    }
    else
    {
        return response.status(401).send({message: " Unauthorized Access"})
    }
}

module.exports = {adminVerify}