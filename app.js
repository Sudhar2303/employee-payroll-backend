require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT
const authRoute = require('./routes/authRoute')
const adminRouter = require('./routes/adminRoute')
const hrRouter = require('./routes/hrRoute')

app.use(express.json());
app.use(express.urlencoded({extended:true})); 


app.use(cookieParser());
app.use(cors(
    {
        origin: true, 
        credentials: true
    }));

app.get('/',(request,response)=>
{
    response.status(201).send({message:'the server is runnning successfully'})
})

app.use('/api/v1',authRoute)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/hr',hrRouter)

mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error',(error)=>console.log(error.message))
db.once('open',()=>console.log('DataBase is connected successfully'))

app.listen(PORT,()=>console.log(`The server is running at http://localhost:${PORT}`))