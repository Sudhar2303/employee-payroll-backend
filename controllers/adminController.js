const { request, response } = require('express')
const employeeData = require('../data/initialEmployeeData')
const employeeDetailsModel = require('../models/EmployeeDetailsModel')
const salaryDetailsModel = require('../models/salaryDetails')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const getEmployeeDetails = async(request,response)=>
{
    try
    {
        const listOfEmployee = await employeeDetailsModel.find()
        if(listOfEmployee.length === 0)
        {
            const updateData = await employeeDetailsModel.insertMany(employeeData)
            return response.status(201).send(updateData)
        }
        else
        {
            return response.status(201).send(listOfEmployee)
        }
    }
    catch(error)
    {
        return response.status(500).send({message: error.message})
    }
}

const postNewEmployee = async(request,response)=>
{
    const newData = request.body
    try
    {
        const existingEmployee = await employeeDetailsModel.findOne({employeeID : newData.employeeID})
        if(!existingEmployee)
        {
            const updateData = await employeeDetailsModel.insertMany(newData)
            return response.status(201).send(updateData)
        }
        else
        {
            return response.status(201).send({message : "The employee Id already exists"})
        }
    }
    catch(error)
    {
        return response.status(500).send({message : error.message})
    }
}


const getTotalEmployeeSalary = async(request,response) =>
{
    try
    {
        const employeeData = await salaryDetailsModel.find()
        if(employeeData.length != 0 )
        {
            const result = await salaryDetailsModel.aggregate([
                {
                    $group: {
                    _id: null,
                    totalSalary: { $sum: { $toDouble: "$salary" } }
                    }
                }
                ])
                return response.status(201).send(result)
        }
        else
        {
            return response.status(201).send({Message: "the employee salary data is empty"})
        }
    }
    catch(error)
    {
        return response.status(500).send({message:error.message})
    }
}

const getAuthenticate = async(request,response)=>
{
    const token = request.cookies
    console.log(token)
    if (token.token != undefined)
    {
        const decoded = jwt.verify(token.token,JWT_SECRET)
        const userData = await userModel.findOne({emailID : decoded})
        if(userData)
        {
            return response.status(201).send({message : "Authorized user"})
        }
    }
    else
    {
        return response.status(401).send({message: " Unauthorized Access"})
    }
}

module.exports = {getEmployeeDetails,postNewEmployee,getTotalEmployeeSalary,getAuthenticate}