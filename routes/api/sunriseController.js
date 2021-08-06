const {getRandomLocations,getRandomGeo}=require('./utils/geoLocations')
const {fetchTimesByRequest,fetchTimesByAxios}=require('./utils/fetchTimes')
const moment=require('moment')

exports.getDayLengthByUrl=async (req,res)=>{
    try{
        //1: dealing with parameters
        const date=req.query.date?req.query.date:process.env.DATE
        const formatted=req.query.formatted?req.query.formatted.toString():process.env.FORMATTED
        const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)
        const lat=(req.query.lat?req.query.lat:process.env.LAT)*1.0
        const lng=(req.query.lng?req.query.lng:process.env.LON)*1.0
        const count=(req.query.count?req.query.count:process.env.COUNT)*1
        const distance=(req.query.distance?req.query.distance:process.env.DISTANCE)*1.0
        console.log(date," ",formatted," ",lat, " ",lng," ",count," ",distance)

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
                try{
                    return fetchTimesByRequest(url+`lat=${_p.latitude}&lng=${_p.longitude}`)
                }catch(err){
                    console.error('how come?',err.message)
                }
            })) 

            //3b: Promise.all().then() ---> finding the earliest sunrise time
            sunrise_times.forEach(_t => {
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
    }
}

exports.getDayLengthByPost=async (req,res)=>{
    try{
        //1 - dealing with input data
        const date=req.body&&req.body.date?req.body.date:process.env.DATE
        const formatted=req.body&&req.body.formatted!=null&&req.body.formatted!=undefined?
                        req.body.formatted.toString():process.env.FORMATTED
        const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)
        const lat=(req.body&&req.body.lat?req.body.lat:process.env.LAT)*1.0
        const lng=(req.body&&req.body.lng?req.body.lng:process.env.LON)*1.0
        const count=(req.body&&req.body.count?req.body.count:process.env.COUNT)*1
        const distance=(req.body&&req.body.distance?req.body.distance:process.env.DISTANCE)*1.0
        console.log(date," ",formatted," ",lat, " ",lng," ",count," ",distance)
        //console.log(req.body.date," ",req.body.formatted," ",req.body.lat, " ",req.body.lng," ",req.body.count," ",req.body.distance)
        if(req.body&&req.body.formatted){console.log('hey')}
        //2 - generating random coordinates
        //method 1
        const point=getRandomLocations(lat,lng,distance,count)
        //method 2
        //const point=getRandomGeo(lat,lng,distance,count);

        //3 - fetching sunrise /sunset times - implemented by axios, and getting earliest sunrise time
        //alternatively can be implemented by request --- see getDayLengthByUrl step 3 above
        const format = formatted=='1'?'hh:mm:ss a':moment.ISO_8601
        //const format = 'h:mm:ss a'
        var earliest=[];earliest.push(undefined)
        var sunriseTimes=[]
        for(let i=0;i<point.length;i=i+5){
            await Promise.all(point.slice(i,Math.min(i+5,point.length)).map(async _p=>{
                try{
                    await fetchTimesByAxios(url+`lat=${_p.latitude}&lng=${_p.longitude}`,sunriseTimes,earliest,format)
                }catch(err){
                    console.log(err)
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
    }
}