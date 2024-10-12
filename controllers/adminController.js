const { request, response } = require('express')
const employeeData = require('../data/initialEmployeeData')
const employeeDetailsModel = require('../models/EmployeeDetailsModel')
const salaryDetailsModel = require('../models/salaryDetails')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
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

const updateExistingEmployee = async(request,response)=>
{
    const toUpdateData = request.body;
    try
    {
        const updatedData = await employeeDetailsModel.updateOne({_id:toUpdateData._id},{$set:toUpdateData});
        if(updatedData)
        {
            return response.status(201).send({message:"Successfully updated data"});
        }
        else
        {
            return response.status(404).send({message:"The Employee Id is not found"});
        }
    }
    catch(error)
    {
        return response.status(500).send({message: error.message})
    }

}

const deleteEmployeeData = async(request,response) =>
{
    const toDeleteData = request.body;
    try
    {
        const deletedData = await employeeDetailsModel.deleteOne({_id:toDeleteData._id})
        if(deletedData)
            return response.status(201).send({message:"The Data Deleted Successfully"});
        else
            return response.status(404).send({message:"The Employee data not found"});
    }
    catch(error)
    {
        response.status(500).send({message:error.message})
    }
}

const getEmployeeCount = async(request,response) =>
{   
    try
    {
        const totalEmployees = await employeeDetailsModel.countDocuments();
        const genderCount = await employeeDetailsModel.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: { $sum: 1 }
                }
            }
        ]);
        const traineeCount = await employeeDetailsModel.countDocuments({ role: "trainee" });

        return response.status(200).send({totalEmployees,genderCount,traineeCount});
    }
    catch(error)
    {
        return response.status(500).send({message:error.message});
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


module.exports = {getEmployeeDetails,postNewEmployee,getTotalEmployeeSalary,getAuthenticate,updateExistingEmployee,deleteEmployeeData,getEmployeeCount}