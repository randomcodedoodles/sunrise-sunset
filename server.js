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

/*
const http=require('http')
const apiReq=require('request')
const url='https://api.sunrisesunset.org/json'
//'https://api.sunrise-sunset.org/json?&&' 'https://api.sunrise-sunset.org/json'  'https://api.sunrise-sunset.org/json?'
//'https://api.sunrise-sunset.org/json?lat=&fr&'  'https://api.sunrise-sunset.org/json?lat=&&'
//'https://api.sunrise-sunset.org/json?lat=&lng&formatted=1.2' /
//or &formatted= or &formatted or &fo or &fr &formatted=0.5 or & -> or all left all ends &
//->non 0 explicitely is 1 -> formatted true

const server=http.createServer(async function (request,response){
    apiReq.get(url,function(error,res,body){
        if(error) {console.log('got you');response.end(error)}
        response.end(body)
    })
}).listen(PORT,()=>console.log(`Server started on port ${PORT}`))
*/



app.all('*',(req,res,next)=>{/*
    const err=new Error(`Cannot find ${req.originalUrl} on this server`)
    err.status='fail';
    err.statusCode=404;
    next(err)*/
    next(new CustomError(`Cannot find ${req.originalUrl} on this server`,404,'fail'))
})
/*app.use((err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error'
    //var message=err.message
    //if(err.status=="INVALID_REQUEST") message="Either lat or lng parameters are missing or invalid"
    //if(err.status=="INVALID_DATE") message="Date parameter is missing or invalid"
    //if(err.status=="UNKNOWN_ERROR") message="The request could not be processed due to a server error. Please try again later."

    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        statusCode:err.statusCode
    })

})*/
app.use(globalErrHandler)

const server=app.listen(PORT,()=>console.log(`Server started on port ${PORT}`)) 

process.on('unhandledRejection',err=>{
    server.close(()=>{process.exit(1)})
})