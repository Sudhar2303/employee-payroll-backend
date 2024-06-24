const employeeData = require('../data/initialEmployeeData')
const employeeDetailsModel = require('../models/EmployeeDetailsModel')
const salaryDetailsModel = require('../models/salaryDetails')

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



const postAllocatedSalary = async(request,response)=>
{
    const data = request.body
    try 
    {
        const existingData = await salaryDetailsModel.findOne({ employeeData : data.employeeData})
        console.log(existingData)
        if(!existingData)
        {
            const fetchEmployeeData = await employeeDetailsModel.findOne({ _id : data.employeeData})
            console.log(fetchEmployeeData)
            switch(fetchEmployeeData.grade)
            {
                case 1:
                    perDaysalary = (data.basicPay * (1 + 0.5 + 0.7 + 0.8))/24
                    break
                
                case 2:
                    perDaysalary = (data.basicPay * (1 + 0.5 + 0.7 + 0.5))/24
                    break

                case 3:
                    perDaysalary = (data.basicPay * (1 + 0.6 + 0.4 + 0.5))/24
                    break
                
                case 4:
                    perDaysalary = (data.basicPay * (1 + 0.4 + 0.5 + 0.3))/24
                    break
                
                case 5:
                    perDaysalary = (data.basicPay * (1 + 0.3 + 0.4 + 0.3))/24
                    break
                default:
                    return response.status(400).send({message : "The grade is not defined"})
                    break
            }
            console.log(perDaysalary)
            const newData = new salaryDetailsModel({
                employeeData : data.employeeData,
                basicPay : data.basicPay,
                dailyPay : perDaysalary
            })
            const updateData = await newData.save()
            return response.status(201).send(updateData)
        }
        else
        {
            return response.status(201).send({message: "The Employee Data already exists"})
        }
    } 
    catch(error)
    {
        return response.status(500).send({message : error.message})
    }
}

module.exports = {getEmployeeDetails,postNewEmployee,getTotalEmployeeSalary}