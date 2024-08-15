
const logoutUser = (request,response) =>
{
    try
    {
        const userCookie = request.cookies
        console.log(" cookie" ,userCookie)
        if(Object.keys(userCookie).length != 0)
        {
            response.clearCookie('token')
            return response.status(201).send({message : "User has been Logout"})
        }
        return response.status(401).send({message : "Invalid Operation"})
    }
    catch(error)
    {
        return response.status(500).send({message : error.message})
    }
}

module.exports = {logoutUser}