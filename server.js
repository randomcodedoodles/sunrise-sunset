
const express=require('express')
const app=express()
const sunriseApiRouter=require('./routes/api/sunrise')

const PORT=process.env.PORT||9090;

app.use(express.urlencoded({extended:false}))
app.use('/',sunriseApiRouter)
const server=app.listen(PORT,()=>console.log(`Server started on port ${PORT}`))
