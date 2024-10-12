const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const JWT_SECRET = process.env.JWT_SECRET
const hrVerify = async(request,response,next)=>
{
    const token = request.cookies
    console.log(token)
    if (token.token != undefined)
    {
        const decoded = jwt.verify(token.token,JWT_SECRET)
        const userData = await userModel.findOne({emailID : decoded})
        if(userData)
        {
            if(userData.role == 'hr')
                next()
            else
                response.status(401).send({message:"Unauthorized Access"})
        }
    }
    else
    {
        return response.status(401).send({message: " Unauthorized Access"})
    }
}

module.exports = {hrVerify}