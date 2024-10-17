const employeeDetailsModel = require('../models/employeeModel')
const gradeModel = require('../models/gradeModel')
const processModel = require('../models/processModel')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const JWT_SECRET = process.env.JWT_SECRET

const postNewEmployee = async(request,response)=>
{
    const newEmployeeData = request.body.employeeID
    const gradeNo = request.body.gradeNo.gradeNo
    const employeeProcessData = request.body
    try
    {
        const existingEmployee = await employeeDetailsModel.findOne({employeeID : newEmployeeData.employeeID})
        if(!existingEmployee)
        {
            const newlyAddedData = await employeeDetailsModel.create(newEmployeeData)
            const grade = await gradeModel.findOne({gradeNo:gradeNo, active: true})
            employeeProcessData.employeeID = newlyAddedData._id
            employeeProcessData.gradeNo = grade._id
            await processModel.create(employeeProcessData);
            return response.status(201).send("The Data added SuccessFully")
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
    const toUpdateEmployeeData = request.body.employeeID
    const toUpdategradeNo = request.body.gradeNo.gradeNo
    const toUpdateEmployeeProcessData = request.body
    try
    {
        const updatedEmployee = await employeeDetailsModel.findOneAndUpdate({employeeID : toUpdateEmployeeData.employeeID},
            {$set : toUpdateEmployeeData})
        const grade = await gradeModel.findOne({gradeNo:toUpdategradeNo, active: true})
        toUpdateEmployeeProcessData.employeeID = toUpdateEmployeeData._id
        toUpdateEmployeeProcessData.gradeNo = grade._id,
        toUpdateEmployeeProcessData.approvalStatus = "pending"
        await processModel.findOneAndUpdate(
            { _id: toUpdateEmployeeProcessData._id },
            { $set: toUpdateEmployeeProcessData }
        );
        return response.status(201).send("The Data is updated SuccessFully")        
    }
    catch(error)
    {
        return response.status(500).send({message : error.message})
    }

}
const getDepartmentViceCount = async(request,response) =>
{
    try
    {
        const departmentEmployeeCount = await employeeDetailsModel.aggregate([
            {
                $group : {
                    _id : "$role",
                    count:{$sum:1}
                }
            }
        ])
        if(departmentEmployeeCount.length > 0)
            return response.status(200).send(departmentEmployeeCount)
        else
            return response.status(500).send({message:"The employee details may be null"})
    }
    catch(error)
    {   
        return response.status(500).send({message:error.message})
    }
}

const getAttendenceStatus = async(request,response) =>
{
    try
    {
        const totalCount = await employeeDetailsModel.aggregate([
            {
                $group :
                {
                    _id :"$status",
                    count :{$sum :1}
                }
            }
        ])
        const departmentCount = await employeeDetailsModel.aggregate([
            {
                $group :
                {
                    _id : "$role",
                    onlineCount :{
                        $sum :
                        {
                            $cond :[{ $eq :['$status','online']},1,0]
                        }
                    },
                    offlineCount :{
                        $sum :
                        {
                            $cond :[{ $eq :['$status','offline']},1,0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,     
                    role: "$_id", 
                    onlineCount: 1, 
                    offlineCount: 1 
                }
            }
        ]);
        return response.status(200).send({totalCount,departmentCount})
    }
    catch(error)
    {
        return response.status(500).send({message:error.message})
    }
}

const getAuthenticate = async(request,response)=>
{
    try
    {
        const token = request.cookies.token
        if (token)
        {
            const decoded = jwt.verify(token,JWT_SECRET)
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
    catch(error)
    {
        return response.status(500).send({message:error.message})
    }
    
}

module.exports = {getAuthenticate,getDepartmentViceCount,getAttendenceStatus,postNewEmployee,updateExistingEmployee}