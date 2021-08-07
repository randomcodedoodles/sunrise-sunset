const {getRandomLocations,getRandomGeo}=require('./utils/geoLocations')
const {fetchTimesByRequest,fetchTimesByAxios}=require('./utils/fetchTimes')
const moment=require('moment')
const CustomError = require('./utils/customError')

exports.getDayLengthByUrl=async (req,res,next)=>{
    try{
        //1: dealing with params
        const date=req.query.date?req.query.date:process.env.DATE
        const formatted=req.query.formatted=='0'?0:process.env.FORMATTED*1
        const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)
        var lat,lng
        if(!req.query.lat&&!req.query.lng){lat=process.env.LAT*1.0;lng=process.env.LON*1.0;}
        else{
            if(req.query.lat&&(isNaN(req.query.lat)||isNaN(parseFloat(req.query.lat))||req.query.lat*1.0<-90||req.query.lat*1.0>90)) throw new CustomError('invalid latitude',400)
            if(req.query.lng&&(isNaN(req.query.lng)||isNaN(parseFloat(req.query.lng))||req.query.lng*1.0<-180||req.query.lng*1.0>180)) throw new CustomError('invalid longitude',400)
            lat=req.query.lat*1.0;lng=preq.query.lng*1.0;
        }
        const count=(req.query.count&&!isNaN(req.query.count)&&!isNaN(parseFloat(req.query.count))?req.query.count:process.env.COUNT)*1
        const distance=(req.query.distance&&!isNaN(req.query.distance)&&!sNaN(parseFloat(req.query.distance))?req.query.distance:process.env.DISTANCE)*1.0
        

        //2: generating random coordinates
        //method 1
        const point=getRandomLocations(lat,lng,distance,count)
        //method 2
        //const point=getRandomGeo(lat,lng,distance,count);

        //3: fetching sunrise /sunset times - implemented by request
        //alternatively can be implemented by axios --- see getDayLengthByPost step 3 below
        const format = formatted=='1'?'hh:mm:ss a':moment.ISO_8601
        var sunriseTimes=[]
        var earliest
        for(let i=0;i<point.length;i=i+5){
            const sunrise_times=await Promise.all(point.slice(i,Math.min(i+5,point.length)).map(_p=>{
                return fetchTimesByRequest(url+`lat=${_p.latitude}&lng=${_p.longitude}`)
            })) 

            //3b: Promise.all().then() ---> finding the earliest sunrise time
            sunrise_times.forEach(_t => {
                if(_t.status!="OK") throw new CustomError(_t.status,400,_t.status)
                const sunrisetime=moment(_t.results.sunrise,format)
                if(earliest==undefined||sunrisetime.isBefore(earliest)) earliest=sunrisetime
                sunriseTimes.push(_t.results)
            })
        }
        
        //4: outputting a list of day lengths that have earliest sunrise time
        const daylength=sunriseTimes.filter(_t=>moment(_t.sunrise,format).isSame(earliest)).map(_el=>_el.day_length)
        res.status(200).send(daylength)

    }catch(err){
        console.error(err.message)
        next(err) 
    }
}

exports.getDayLengthByPost=async (req,res,next)=>{
    try{
        //1 - dealing with input data - similar to DB model field validation
        const date= typeof req.body.date=='string'?req.body.date:process.env.DATE
        const formatted= req.body.formatted===0?0:process.env.FORMATTED*1
        const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)

        if(!req.body.lat&&!req.body.lng){lat=process.env.LAT*1.0;lng=process.env.LON*1.0;}
        else{
            if(typeof req.body.lat!='number'||req.body.lat*1.0<-90||req.body.lat*1.0>90) throw new CustomError('invalid latitude',400)
            if(typeof req.body.lng!='number'||req.body.lng*1.0<-180||req.body.lng*1.0>180) throw new CustomError('invalid longitude',400)
            lat=req.body.lat*1.0;lng=preq.body.lng*1.0;
        }
        const count=Math.ceil(typeof req.body.count=='number'?req.body.count:process.env.COUNT)
        const distance=(typeof req.body.distance=='number'?req.body.distance:process.env.DISTANCE)*1.0
        
        //2 - generating random coordinates
        //method 1
        const point=getRandomLocations(lat,lng,distance,count)
        //method 2
        //const point=getRandomGeo(lat,lng,distance,count);

        //3 - fetching sunrise /sunset times - implemented by axios, and getting earliest sunrise time
        //alternatively can be implemented by request --- see getDayLengthByUrl step 3 above
        const format = formatted===1?'hh:mm:ss a':moment.ISO_8601
        var earliest=[];earliest.push(undefined)
        var sunriseTimes=[]
        for(let i=0;i<point.length;i=i+5){
            await Promise.all(point.slice(i,Math.min(i+5,point.length)).map(async _p=>{
                try{
                    await fetchTimesByAxios(url+`lat=${_p.latitude}&lng=${_p.longitude}`,sunriseTimes,earliest,format)
                }catch(err){
                    throw new CustomError(err.message,err.statusCode,err.status)
                }
            }))
            
        }

        //4 - outputting a list of day lengths that have earliest sunrise time
        const daylength=sunriseTimes.filter(_t=>moment(_t.sunrise,format).isSame(earliest[0]))
                                    .map(_el=>_el.day_length)
        
        res.status(200).send(daylength)

    }catch(err){
        console.error(err.message)
        next(err)
    }
}