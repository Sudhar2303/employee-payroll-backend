require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT
const loginRouter = require('./routes/loginRoute')
const adminRouter = require('./routes/adminRoute')
const hrRouter = require('./routes/hrRoute')

app.get('/',(request,response)=>
{
    response.status(201).send({message:'the server is runnning successfully'})
})
app.use(express.json())
app.use(cors(
    {
        origin: 'https://employee-payroll-frontend-six.vercel.app/',
        credentials: true
    }))
app.use(cookieParser())
app.use('/api/v1/login',loginRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/hr',hrRouter)


mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error',(error)=>console.log(error.message))
db.once('open',()=>console.log('DataBase is connected successfully'))

app.listen(PORT,()=>console.log(`The server is running at http://localhost:${PORT}`))