const EmployeeDetailsModel = require('../models/EmployeeDetailsModel')
const salaryDetailsModel = require('../models/salaryDetails')

const getAttendedHoursData = async(request,response)=>
{
    try
    {
        const userData = await salaryDetailsModel.find()
        if(userData!=0)
        {
            return response.status(201).send(userData)
        }
        else
        {
            return response.status(201).send({message : "the database is empty"})
        }
    }
    catch(error)
    {
        return response.status(500).send({message : error.message})
    }
}

const postAttendedHours = async(request,response)=>
{
    const data = request.body
    console.log(data)
    try
    {
        const existingData  = await salaryDetailsModel.findOne({employeeID: data.employeeID})
        console.log(existingData)
        if(!existingData)
        {
            const fetchEmployeeData = await EmployeeDetailsModel.findOne({_id : data.employeeID})
            console.log(fetchEmployeeData)
            if (fetchEmployeeData)
            {
                switch(fetchEmployeeData.grade)
                {
                    case 1:
                        perDaysalary = (fetchEmployeeData.basicPay * (1 + 0.5 + 0.7 + 0.8))/24
                        break
                    
                    case 2:
                        perDaysalary = (fetchEmployeeData.basicPay * (1 + 0.5 + 0.7 + 0.5))/24
                        break

                    case 3:
                        perDaysalary = (fetchEmployeeData.basicPay * (1 + 0.6 + 0.4 + 0.5))/24
                        break
                    
                    case 4:
                        perDaysalary = (fetchEmployeeData.basicPay * (1 + 0.4 + 0.5 + 0.3))/24
                        break
                    
                    case 5:
                        perDaysalary = (fetchEmployeeData.basicPay * (1 + 0.3 + 0.4 + 0.3))/24
                        break
                    default:
                        return response.status(400).send({message : "The grade is not defined"})
                }
                console.log(perDaysalary,data.workingDays)
                const newData = await salaryDetailsModel(
                    {
                        employeeID:data.employeeID,
                        employeeName: fetchEmployeeData.employeeName,
                        perDaySalary: parseFloat(perDaysalary.toFixed(2)),
                        month:data.month ,
                        workingDays: data.workingDays,
                        salary: (perDaysalary * data.workingDays).toFixed(2)
                    }
                )
                const updateData = await newData.save()
                return response.status(201).send(updateData)
            }
            else
            {
                return response.status(201).send({messsage: "The employeeData Not found check the employeeID"})
            }
        }
        else
        {
            const fetchEmployeeData = await EmployeeDetailsModel.findOne({ _id : data.employeeID})
            if(fetchEmployeeData)
            {
                const updateData = await salaryDetailsModel.updateMany({ _id :data.employeeID},{$set :
                    {
                        month : data.month,
                        workingDays:data.workingDays,
                        salary : (existingData.perDaySalary * data.workingDays)
                    }
                })
                return response.status(201).send(updateData)
            }
            else
            {
                return response.status(201).send({messsage: "The employeeData Not found check the employeeID"})
            }
        }
        
    }
    catch(error)
    {
        response.status(500).send({message : error.message})
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
module.exports = {getAttendedHoursData,postAttendedHours,getTotalEmployeeSalary,getAuthenticate}