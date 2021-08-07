const dotenv=require('dotenv').config({path:'./.env'})
process.on('unhandledRejection',err=>{
    process.exit(1)
})
const express=require('express')

const app=express()
const sunriseApiRouter=require('./routes/api/sunrise');
const CustomError = require('./routes/api/utils/customError');
const globalErrHandler = require('./globalErrHandler')

const PORT=process.env.PORT||9090;

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use('/',sunriseApiRouter)

app.all('*',(req,res,next)=>{
    next(new CustomError(`Cannot find ${req.originalUrl} on this server`,404,'fail'))
})
app.use(globalErrHandler)

const server=app.listen(PORT,()=>console.log(`Server started on port ${PORT}`)) 

process.on('unhandledRejection',err=>{
    server.close(()=>{process.exit(1)})
})