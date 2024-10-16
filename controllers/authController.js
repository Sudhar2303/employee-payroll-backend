const initialUserData = require('../data/initialUserData')
const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET

const loginUser = async(request,response)=>
{
    try
    {
        const listOfUsers = await userModel.find()
        if(listOfUsers.length === 0)
        {
            for(let userData of initialUserData)
            {
                const initialData = await userModel(userData)
                await initialData.save()
            }
        }
        const validUser = await userModel.findOne({emailID : request.body.emailID})
        if(!validUser)
        {
            return response.status(401).send({message: "Invalid email-ID"})
        }
        if(await bcrypt.compare(request.body.password,validUser.password))
        {
            const AUTH_TOKEN = jwt.sign(validUser.emailID,jwt_secret)
            response.cookie('token',AUTH_TOKEN,{
                 httpOnly: true,
                 secure: true,
                 sameSite: 'None',
                 path: '/'
                })
            return response.status(201).send({role:validUser.role,token : AUTH_TOKEN})
        }
        else
        {
            return response.status(401).send({message:"Invalid password"})
        }
    }
    catch(error)
    {
        response.status(501).send({message:error.message})
    }
}

const logoutUser = (request,response) =>
{
    try
    {
        const userCookie = request.cookies
        if(Object.keys(userCookie).length != 0)
        {
            response.clearCookie('token',{
                httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    path: '/'
            })
            return response.status(201).send({message : "User has been Logout"})
        }
        return response.status(401).send({message : "Invalid Operation"})
    }
    catch(error)
    {
        return response.status(500).send({message : error.message})
    }
}

module.exports = {loginUser,logoutUser}