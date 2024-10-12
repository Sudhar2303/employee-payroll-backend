const employeeDetailsModel = require('../models/EmployeeDetailsModel')
const salaryDetailsModel = require('../models/salaryDetails')

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
module.exports = {getTotalEmployeeSalary,getAuthenticate,getDepartmentViceCount,getAttendenceStatus}