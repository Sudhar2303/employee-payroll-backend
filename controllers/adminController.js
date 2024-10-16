const gradeModel = require('../models/gradeModel')
const employeeDetailsModel = require('../models/employeeModel')
const processModel = require('../models/processModel')
const attendanceLogModel = require('../models/attendanceModel')
const gradeData = require('../data/initialGradeData')
const employeeData = require('../data/initialEmployeeData')
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
            await employeeDetailsModel.insertMany(employeeData)
        }
        const approvedData = await processModel.find({active : true}).populate({
            path:'employeeID',
            model:'employeeDetails',
            select:'employeeID employeeName role'
        }).populate({
            path:'gradeNo',
            model:'employee_grade',
            select:'gradeNo'
        })
        return response.status(200).send(approvedData)
    }
    catch(error)
    {
        return response.status(500).send({message: error.message})
    }
}

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
            newEmployeeData.approvalStatus = "approved"
            const newlyAddedData = await employeeDetailsModel.create(newEmployeeData)
            const grade = await gradeModel.findOne({gradeNo:gradeNo, active: true})
            employeeProcessData.employeeID = newlyAddedData._id
            employeeProcessData.gradeNo = grade._id
            await processModel.create(employeeProcessData);
            return response.status(201).send("The Data added SuccessFully")
        }
        else
        {
            return response.status(409).send({message : "The employee Id already exists"})
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
        toUpdateEmployeeProcessData.gradeNo = grade._id
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

const deleteEmployeeData = async(request,response) =>
{
    const processEmployeeID = request._id
    const employeeID = request.employeeID 
    try
    {
        const deletedEmployeeID = await employeeDetailsModel.deleteOne({_id:employeeID})
        const deletedProcessData = await processModel.deleteOne({_id:processEmployeeID})
        if(deletedEmployeeID.deletedCount == 1 && deletedProcessData.deletedCount == 1 )
            return response.status(201).send({message:"The Data Deleted Successfully"});
        else
            return response.status(404).send({message:"The Employee data not found"});
    }
    catch(error)
    {
        response.status(500).send({message:error.message})
    }
}

const getGradeData = async(request,response) =>
{
    try
    {
        const listOfGrade = await gradeModel.find()
        if(listOfGrade.length == 0)
        {
            await gradeModel.insertMany(gradeData)
        } 
        const activeData = await gradeModel.find({active: true})
        return response.status(201).send(activeData)
    }
    catch(error)
    {
        return response.status(500).send({message: error.message})
    }
}

const addNewGrade = async(request,response)=>
{
    const newData  =request.body
    try
    {
        const existingGrade =await gradeModel.findOne({gradeNo : newData.gradeNo})
        if(!existingGrade)
        {
            newData.active = true
            await gradeModel.create(newData)
            return response.status(201).send({message : "The new Grade is added successfully"})
        }
        return response.status(404).send({message:"The Grade already exists"})
    }
    catch(error)
    {
        return response.status(500).send({message:error.message})
    }
}

const updateGrade = async(request,response) =>
{
    const toUpdateData = request.body
    try
    {   
        const existingGrade = await gradeModel.findOne({gradeNo : toUpdateData.gradeNo, active:true})
        if(existingGrade)
        {
            await gradeModel.findOneAndUpdate({gradeNo : toUpdateData.gradeNo,active :true},{active:false})
        }
        toUpdateData.active = true
        const updatedData = await gradeModel.create(toUpdateData)
        return response.status(201).send(updatedData)
    }
    catch(error)
    {
        return response.status(500).send({message:error.message})
    }
}

const getPendingRequest = async(request,response) =>
{
    try
    {
        const pendingProcessRequest = await processModel.find({approvalStatus:"pending"}).populate({
            path:'employeeID',
            model:'employeeDetails',
            select:'employeeID employeeName role approvalStatus'
        })
        return response.status(200).send(pendingProcessRequest)
    }
    catch(error)
    {
        return response.status(500).send({message:error.message})
    }
}

const updatePendingApproval = async(request,response)=>
{
    const processEmployeeID = request.body
    const employeeID = request.body.employeeID._id
    try
    {
        const updatedEmployeeData = await employeeDetailsModel.findOneAndUpdate({_id: employeeID},{
            approvalStatus : processEmployeeID.approvalStatus
        })
        const UpdatedProcessEmployee = await processModel.findOneAndUpdate({_id:processEmployeeID._id},{
            approvalStatus : processEmployeeID.approvalStatus
        })
        return response.status(201).send({message : "Changed the approval Status successfully"})
    }
    catch(error)
    {
        return response.status(500).send({message:error.message})
    }
}

const calculateAndUpdateSalaries = async (request, response) => {
    try {
        const now = new Date();
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const processRecords = await processModel.find({
            date: {
                $gte: startOfLastMonth,
                $lt: endOfLastMonth
            }
        }).populate('employeeID').populate('gradeNo');

        for (const record of processRecords) {
            const { employeeID, gradeNo } = record;
            
            const attendanceLogs = await attendanceLogModel.find({
                employeeID: employeeID._id,
                startTime: 
                { 
                    $gte: startOfLastMonth,
                    $lt: endOfLastMonth
                }
            });
            const totalHours = attendanceLogs.reduce((sum, log) => sum + log.workingHours, 0);
            const basicPay = gradeNo.basicPay;
            const hourlyRate = basicPay / 160;
            const hra = gradeNo.hra * basicPay;
            const da = gradeNo.da * basicPay;

            const salary = (hourlyRate * totalHours) + hra + da;

            await processModel.findOneAndUpdate(
                { _id: record._id },
                {
                    active: false
                }).catch(err => console.error("Update failed:", err));

            const newProcessRecord = new processModel({
                employeeID: employeeID._id,
                gradeNo: gradeNo._id,
                basicPay: basicPay,
                salary: salary,
                totalWorkingHours: totalHours,
                active: true,
                date: new Date(),
                approvalStatus: 'approved'
            });

            await newProcessRecord.save().catch(err => console.error("Save failed:", err));
        }

        return response.status(201).send({ message: "Salary calculations and updates completed successfully." });
    } catch (error) {
        return response.status(500).send({ message: error.message });
    }
};

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

const getAuthenticate = async(request,response)=>
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


module.exports = {getEmployeeDetails,postNewEmployee,getAuthenticate,updateExistingEmployee, calculateAndUpdateSalaries,
                updatePendingApproval,getPendingRequest,deleteEmployeeData,getGradeData,addNewGrade,updateGrade,getEmployeeCount}