const {getRandomLocations,getRandomGeo}=require('./utils/geoLocations')
const {fetchTimesByRequest,fetchTimesByAxios}=require('./utils/fetchTimes')
const moment=require('moment')
const CustomError = require('./utils/customError')

exports.getDayLengthByUrl=async (req,res,next)=>{
    try{
        //1: dealing with parameters
        ////if(req.query){
            ////if(!req.query.lat||typeof req.query.lat!=number ||req.query.lat<> range)
            //if(req.query.lat&&(isNaN(req.query.lat)||isNaN(parseFloat(req.query.lat))||req.query.lat*1.0<-90||req.query.lat*1.0>90)) throw new CustomError('invalid latitude',400)
             //if(req.query.lng&&(isNaN(req.query.lng)||isNaN(parseFloat(req.query.lng))||req.query.lng*1.0<-180||req.query.lng*1.0>180)) throw new CustomError('invalid longitude',400)
       ////}
        const date=req.query.date?req.query.date:process.env.DATE
        //const formatted=req.query.formatted?req.query.formatted.toString():process.env.FORMATTED
        console.log(typeof req.query.formatted,typeof process.env.FORMATTED)
        const formatted=req.query.formatted=='0'?req.query.formatted:process.env.FORMATTED
        const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)
        //const lat=(req.query.lat?req.query.lat:process.env.LAT)*1.0
        //const lng=(req.query.lng?req.query.lng:process.env.LON)*1.0
        console.log("dshkd"*1)
        var lat,lng
        //if(req.query.lat||req.query.lng){lat=req.query.lat*1.0;lng=req.query.lng*1.0}
        //else{lat=process.env.LAT*1.0;lng=process.env.LON*1.0}
        if(!req.query.lat&&!req.query.lng){lat=process.env.LAT*1.0;lng=process.env.LON*1.0;}
        else{
            if(req.query.lat&&(isNaN(req.query.lat)||isNaN(parseFloat(req.query.lat))||req.query.lat*1.0<-90||req.query.lat*1.0>90)) throw new CustomError('invalid latitude',400)
            if(req.query.lng&&(isNaN(req.query.lng)||isNaN(parseFloat(req.query.lng))||req.query.lng*1.0<-180||req.query.lng*1.0>180)) throw new CustomError('invalid longitude',400)
            lat=req.query.lat*1.0;lng=preq.query.lng*1.0;
        }

        const count=(req.query.count&&!isNaN(req.query.count)&&!isNaN(parseFloat(req.query.count))?req.query.count:process.env.COUNT)*1
        const distance=(req.query.distance&&!isNaN(req.query.distance)&&!sNaN(parseFloat(req.query.distance))?req.query.distance:process.env.DISTANCE)*1.0
        
        console.log(date," ",formatted," ",lat, " ",lng," ",count," ",distance)
        console.log(formatted,typeof formatted)

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
            const sunrise_times=await Promise.all(point.slice(i,Math.min(i+5,point.length)).map(_p=>{ //console.log(_p.longitude)
                //try{
                    return fetchTimesByRequest(url+`lat=${_p.latitude}&lng=${_p.longitude}`)
                    //return fetchTimesByRequest(url+`lat=`)
                //}catch(err){
                //    console.error('how come?',err.message)
                //    next(err) //throw new customError(err)
                //}
            })) 

            //3b: Promise.all().then() ---> finding the earliest sunrise time
            sunrise_times.forEach(_t => {
                //if(_t.status!="OK") throw new Error(_t.status)
                if(_t.status!="OK") throw new CustomError(_t.status,400,_t.status)
                const sunrisetime=moment(_t.results.sunrise,format) //sunrisetime=_t.results.sunrise,format
                console.log(_t.results.sunrise,sunrisetime)
                if(earliest==undefined||sunrisetime.isBefore(earliest)) earliest=sunrisetime
                //moment(sunrisetime,format).isBefore(moment(earliest,format))
                // moment(sunrisetime,format).isBefore(earliest,format) earliest=moment(sunrisetime)
                sunriseTimes.push(_t.results)
            })
        }
        console.log(earliest)
        //4: outputting a list of day lengths that have earliest sunrise time
        const daylength=sunriseTimes.filter(_t=>moment(_t.sunrise,format).isSame(earliest)).map(_el=>_el.day_length)
        res.status(200).send(daylength)

    }catch(err){
        console.error(err.message)
        next(err) //or new (new customError(err))
    }
}

exports.getDayLengthByPost=async (req,res,next)=>{
    try{
        //1 - dealing with input data
        /*if(req.body){
            //if(!req.query.lat||typeof req.query.lat!=number ||req.query.lat<> range)
            if(req.body.lat&&(isNaN(req.body.lat)||isNaN(parseFloat(req.body.lat))||req.body.lat*1.0<-90||req.body.lat*1.0>90)) throw new CustomError('invalid latitude',400)
            if(req.body.lng&&(isNaN(req.body.lng)||isNaN(parseFloat(req.body.lng))||req.body.lng*1.0<-180||req.body.lng*1.0>180)) throw new CustomError('invalid longitude',400)
        }*/
        //if(req.body&&(typeof req.body.lat!='number'||req.body.lat*1.0<-90||req.body.lat*1.0>90))throw new CustomError('invalid latitude',400)
        //if(req.body&&(typeof req.body.lat!='number'||req.body.lat*1.0<-90||req.body.lat*1.0>90))throw new CustomError('invalid latitude',400)

        const date=req.body&&typeof req.body.date=='string'?req.body.date:process.env.DATE
        //const formatted=req.body&&req.body.formatted!=null&&req.body.formatted!=undefined?
        //                req.body.formatted.toString():process.env.FORMATTED
        //const formatted=req.body&&req.body.formatted*1==0?0:process.env.FORMATTED*1
        const formatted=req.body&&req.body.formatted===0?0:process.env.FORMATTED*1
        const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)
        //const lat=(req.body&&req.body.lat?req.body.lat:process.env.LAT)*1.0
        //const lng=(req.body&&req.body.lng?req.body.lng:process.env.LON)*1.0
        //const lat=(req.body&&typeof req.body.lat=='number'?req.body.lat:process.env.LAT)*1.0
        //const lng=(req.body&&typeof req.body.lng=='number'?req.body.lng:process.env.LON)*1.0

        if(!req.body.lat&&!req.body.lng){lat=process.env.LAT*1.0;lng=process.env.LON*1.0;}
        else{
            if(typeof req.body.lat!='number'||req.body.lat*1.0<-90||req.body.lat*1.0>90) throw new CustomError('invalid latitude',400)
            if(typeof req.body.lng!='number'||req.body.lng*1.0<-180||req.body.lng*1.0>180) throw new CustomError('invalid longitude',400)
            lat=req.query.lat*1.0;lng=preq.query.lng*1.0;
        }
        //const count=(req.body&&req.body.count?req.body.count:process.env.COUNT)*1
        //const distance=(req.body&&req.body.distance?req.body.distance:process.env.DISTANCE)*1.0
        const count=Math.ceil(req.body&&typeof req.body.count=='number'?req.body.count:process.env.COUNT)
        const distance=(req.body&&typeof req.body.distance=='number'?req.body.distance:process.env.DISTANCE)*1.0
        console.log(date," ",formatted," ",lat, " ",lng," ",count," ",distance)
        //console.log(req.body.date," ",req.body.formatted," ",req.body.lat, " ",req.body.lng," ",req.body.count," ",req.body.distance)
        if(req.body&&req.body.formatted){console.log('hey')}
        console.log(req.body.formatted,typeof req.body.formatted)
        console.log(formatted,typeof formatted)
        //2 - generating random coordinates
        //method 1
        const point=getRandomLocations(lat,lng,distance,count)
        //method 2
        //const point=getRandomGeo(lat,lng,distance,count);

        //3 - fetching sunrise /sunset times - implemented by axios, and getting earliest sunrise time
        //alternatively can be implemented by request --- see getDayLengthByUrl step 3 above
        //const format = formatted=='1'?'hh:mm:ss a':moment.ISO_8601
        const format = formatted===1?'hh:mm:ss a':moment.ISO_8601
        //const format = 'h:mm:ss a'
        var earliest=[];earliest.push(undefined)
        var sunriseTimes=[]
        for(let i=0;i<point.length;i=i+5){
            await Promise.all(point.slice(i,Math.min(i+5,point.length)).map(async _p=>{
                try{
                    await fetchTimesByAxios(url+`lat=${_p.latitude}&lng=${_p.longitude}`,sunriseTimes,earliest,format)
                    //await fetchTimesByAxios(url,sunriseTimes,earliest,format)

                }catch(err){
                    console.log(err)
                    //neither next(err) or return next(err) -> cannot send header res.send later after this line
                    //throw new Error('middle')

                    //throw new Error(err.message)
                    throw new CustomError(err.message,err.statusCode,err.status)
                }
            }))
            
        }

        console.log(earliest[0])
        //4 - outputting list of day length with the earliest sunrise time
        //const daylength=sunriseTimes.filter(_t=>moment(_t.results.sunrise,format).isSame(earliest[0]))
        //                            .map(_el=>_el.results.day_length)
        //const daylength=sunriseTimes.filter(_t=>_t.isSame(earliest[0]))
        const daylength=sunriseTimes.filter(_t=>moment(_t.sunrise,format).isSame(earliest[0]))
                                    .map(_el=>_el.day_length)
        console.log(daylength.length)
        res.status(200).send(daylength)

    }catch(err){
        console.log(err)
        next(err)//throw new customError(err)
    }
}



exports.test1=async (req,res,next)=>{ console.log("hfdsh"*1,typeof ("dskhd"*1)=='number', typeof ("12"*1)=='number',typeof (3)=='number')
    try{
        const url=//'https://api.sunrisesunset.org/json?date=0latasgjlng=dhs'
        //'https://api.sunrise-sunset.org/json?date=0latasgjlng=dhs'
        //'https://api.sunrisesunset.org/json?lat=asgj&lng=dhs' 'https://api.sunrise-sunset.org/json?latasgjlng=dhs'
        //'https://api.sunrise-sunset.org/json?lat=asgj&lng=dhs'
        //'https://api.sunrise-sunset.org/json?lat=asgj07&  'https://api.sunrise-sunset.org/json?lat=asgj07&l
        //'https://api.sunrise-sunset.org/json?lat=asgj07&lng=   'https://api.sunrise-sunset.org/json?lat=asgj07&lng
        //'https://api.sunrise-sunset.org/json?lat=asgj07&l=  'https://api.sunrise-sunset.org/json?lat=asgj07&lg
        //'https://api.sunrise-sunset.org/json?lat=asgj07&lg=
        'https://api.sunrise-sunset.org/json?lat=asgj&lng=dhs&date=010'
        //'https://api.sunrise-sunset.org/json?lat=asgj&lng=dhs'//tiday t0day
        data=await fetchTimesByRequest(url)
        console.log('test1')
        //if(data.status!="OK") throw new CustomError(data.status,400,data.status)
        if(data.status!="OK") throw new CustomError('',400,data.status)
        res.send(data)

    }catch(err){
        console.log('propgate ',err)
        next(err)//throw new customError(err)
    }
}
exports.test2=async (req,res,next)=>{
    try{
        var earliest=[];earliest.push(undefined)
        var sunriseTimes=[]
        const url=//'https://api.sunrisesunset.org/json?ld567h897s&'//'https://api.sunrise-sunset.org/json?ld567h897s&'
        //'https://api.sunrise-sunset.org/json?lat=as765gj555lng=d567h897s&'//still lat lng 00
        //'https://api.sunrise-sunset.org/json?lat=as765gj555&lng=d567h897s&date=t0day' //still today
        //'https://api.sunrise-sunset.org/json?lat=as765gj555&lng=d567h897s'
        'https://api.sunrise-sunset.org/json?lat=as765gj555&lng=d567h897s&date=010'
        //'https://api.sunrise-sunset.org/json?lat='//tiday t0day 
        //https://api.sunrise-sunset.org/json?lat=   //https://api.sunrise-sunset.org/json?lat
        //https://api.sunrise-sunset.org/json?l //https://api.sunrise-sunset.org/json?
        //https://api.sunrise-sunset.org/jso?lat=
        await fetchTimesByAxios(url,sunriseTimes,earliest,'0')
        console.log('test2')
        res.send(sunriseTimes)

    }catch(err){
        console.log(err)
        next(err)//throw new customError(err)
    }
}