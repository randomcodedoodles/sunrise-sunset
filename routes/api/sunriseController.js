const {getRandomLocations,getRandomGeo}=require('./utils/geoLocations')
const {fetchTimesByRequest,fetchTimesByAxios}=require('./utils/fetchTimes')
const moment=require('moment')
const CustomError = require('./utils/customError')
const extendedFeature = require('./utils/extendedFeature')

exports.getDayLengthByUrl=async (req,res,next)=>{
    try{
        //Step 1: dealing with params
        const date = req.query.date?req.query.date:process.env.DATE
        //if date='010' sunrise-sunset api will return INVALID_DATE; if date='abc', default date in process.env will be used to call sunrise-sunset api
        const formatted = req.query.formatted=='0'?req.query.formatted:process.env.FORMATTED
        //if '0' not explicitely in req.query string, the default process.env will be used, i.e. formatted output
        const url = process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)
        //if neither lat nor lng provided, use process.env values; if one provided the other has to be provided too; 
        //both lat & lng then are checked - if numeric? if within the range of [-90,+90] [-180,+180]
        //yes -> convered to float type; no -> throw error which will be in the form of alert @front-end
        var lat,lng
        if(!req.query.lat&&!req.query.lng){lat = process.env.LAT*1.0; lng = process.env.LON*1.0;}
        else{
            if(!req.query.lat||(isNaN(req.query.lat)||isNaN(parseFloat(req.query.lat))||req.query.lat*1.0<-90||req.query.lat*1.0>90)) throw new CustomError('invalid latitude',400)
            if(!req.query.lng||(isNaN(req.query.lng)||isNaN(parseFloat(req.query.lng))||req.query.lng*1.0<-180||req.query.lng*1.0>180)) throw new CustomError('invalid longitude',400)
            lat = req.query.lat*1.0;lng = req.query.lng*1.0;
        }
        //if count & distance are provided and numeric, convert to int/float; if not, use default values in process.env
        //count: number of points, e.g. 100 points 50 points etc
        const count=(req.query.count&&!isNaN(req.query.count)&&!isNaN(parseFloat(req.query.count))?req.query.count:process.env.COUNT)*1
        //radius from center (lat, lng) - lat/lng + radiusDistance = area where points will be generated
        const distance=(req.query.distance&&!isNaN(req.query.distance)&&!isNaN(parseFloat(req.query.distance))?req.query.distance:process.env.DISTANCE)*1.0
        
        //correct data type of lat lng radius/distance & count to be used in step 2 to generate random points

        //Step 2: generating random coordinates - 'count' number of points based on 'lat' 'lng' 'distance'
        //method 1
        const point=getRandomLocations(lat,lng,distance,count)
        //method 2
        //const point=getRandomGeo(lat,lng,distance,count);


        //Step 3: fetching sunrise /sunset times - implemented by request
        //Alternatively can be implemented by axios --- see getDayLengthByPost Step 3 below
        const format = formatted=='1'?'hh:mm:ss a':moment.ISO_8601
        const unit = formatted=='1'? 'hh:mm:ss':'seconds'
        var sunriseTimes=[]
        var earliest
        for(let i=0;i<point.length;i=i+5){
            //fetch times for not more than 5 points in parallel
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
        console.log(sunriseTimes.length)
        //Step 4: outputting a list of day lengths that have earliest sunrise time
        //const daylength=sunriseTimes.filter(_t=>moment(_t.sunrise,format).isSame(earliest)).map(_el=>_el.day_length)
        res.status(200).send({results: sunriseTimes, unit}) //res.status(200).send({results: sunriseTimes, unit: `${}`})
        //Alternatively can use extendedFeature to find a list of output of which input meets criteria
        //res.status(200).send(extendedFeature.getMinMax(0,'sunrise', 'day_length',sunriseTimes,format))
        //res.status(200).send(extendedFeature.getMinMax(1,'day_length','sunrise', sunriseTimes,format))

    }catch(err){
        console.error(err.message)
        next(err) 
    }
}

exports.getDayLengthByPost=async (req,res,next)=>{
    try{
        //Step 1 - dealing with input data - similar to DB model field validation
        const date= typeof req.body.date=='string'?req.body.date:process.env.DATE
        //if date='010' sunrise-sunset api will return INVALID_DATE; if date='abc', default date in process.env will be used to call sunrise-sunset api
        const formatted= req.body.formatted===0?0:process.env.FORMATTED*1
        //if int 0 not explicitely in req.body, the default process.env will be used, i.e. formatted output
        const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)

        //if neither lat nor lng provided, use process.env values; if one provided the other has to be provided too; 
        //making sure user input correct data type & range otherwise user receives alert (throw error here); then data converted to float type
        if(!req.body.lat&&!req.body.lng){lat=process.env.LAT*1.0;lng=process.env.LON*1.0;}
        else{
            if(!req.body.lat||typeof req.body.lat!='number'||req.body.lat*1.0<-90||req.body.lat*1.0>90) throw new CustomError('invalid latitude',400)
            if(!req.body.lng||typeof req.body.lng!='number'||req.body.lng*1.0<-180||req.body.lng*1.0>180) throw new CustomError('invalid longitude',400)
            lat=req.body.lat*1.0;lng=req.body.lng*1.0;
        }
        //if count & distance are provided and numeric, convert to int/float; if not, use default values in process.env
        //count: number of points, e.g. 100 points 50 points etc
        const count=Math.ceil(typeof req.body.count=='number'?req.body.count:process.env.COUNT)
        //radius from center (lat, lng) - lat/lng + radiusDistance = area where points will be generated
        const distance=(typeof req.body.distance=='number'?req.body.distance:process.env.DISTANCE)*1.0

        //correct data type of lat lng radius/distance & count to be used in Step 2 to generate random points
        
        //Step 2 - generating random coordinates - 'count' number of points based on 'lat' 'lng' 'distance'
        //method 1
        const point=getRandomLocations(lat,lng,distance,count)
        //method 2
        //const point=getRandomGeo(lat,lng,distance,count);

        //Step 3 - fetching sunrise /sunset times - implemented by axios, and getting earliest sunrise time
        //alternatively can be implemented by request --- see getDayLengthByUrl step 3 above
        const format = formatted===1?'hh:mm:ss a':moment.ISO_8601
        var earliest=[];earliest.push(undefined)
        var sunriseTimes=[]
        for(let i=0;i<point.length;i=i+5){
            //fetch times for not more than 5 points in parallel
            await Promise.all(point.slice(i,Math.min(i+5,point.length)).map(async _p=>{
                try{
                    await fetchTimesByAxios(url+`lat=${_p.latitude}&lng=${_p.longitude}`,sunriseTimes,earliest,format)
                }catch(err){
                    throw new CustomError(err.message,err.statusCode,err.status)
                }
            }))
            
        }

        //Step 4 - outputting a list of day lengths that have earliest sunrise time
        const daylength=sunriseTimes.filter(_t=>moment(_t.sunrise,format).isSame(earliest[0]))
                                    .map(_el=>_el.day_length)
        console.log(sunriseTimes.length)
        res.status(200).send(sunriseTimes)
        //Alternatively can use extendedFeature to find a list of output of which input meets criteria
        //res.status(200).send(extendedFeature.getMinMax(0,'sunrise','day_length',sunriseTimes,format))

    }catch(err){
        console.error(err.message)
        next(err)
    }
}