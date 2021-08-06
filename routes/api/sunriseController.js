const {getRandomLocations,getRandomGeo}=require('./utils/geoLocations')
const {fetchTimesByRequest,fetchTimesByAxios}=require('./utils/fetchTimes')

exports.getDayLengthByUrl=(req,res)=>{
    //1: dealing with parameters
    const date=req.query.date?req.query.date:process.env.DATE
    const formatted=req.query.formatted?req.query.formatted.toString():process.env.FORMATTED
    const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)
    const lat=(req.query.lat?req.query.lat:process.env.LAT)*1.0
    const lng=(req.query.lng?req.query.lng:process.env.LON)*1.0
    const count=(req.query.count?req.query.count:process.env.COUNT)*1
    const distance=(req.query.distance?req.query.distance:process.env.DISTANCE)*1.0

    //2: generating random coordinates
    //method 1
    const point=getRandomLocations(lat,lng,distance,count)
    //method 2
    //const point=getRandomGeo(lat,lng,distance,count);
}

exports.getDayLengthByPost=async (req,res)=>{
    try{
        //1 - dealing with input data
        const date=req.body&&req.body.date?req.body.date:process.env.DATE
        const formatted=req.body&&req.body.formatted?req.body.formatted.toString():process.env.FORMATTED
        const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)
        const lat=(req.body&&req.body.lat?req.body.lat:process.env.LAT)*1.0
        const lng=(req.body&&req.body.lng?req.body.lng:process.env.LON)*1.0
        const count=(req.body&&req.body.count?req.body.count:process.env.COUNT)*1
        const distance=(req.body&&req.body.distance?req.body.distance:process.env.DISTANCE)*1.0

        //2 - generating random coordinates
        //method 1
        const point=getRandomLocations(lat,lng,distance,count)
        //method 2
        //const point=getRandomGeo(lat,lng,distance,count);

        const format = formatted=='0'?'hh:mm:ss a':''
        var earliest=[];earliest.push(undefined)
        var sunriseTimes=[]
        for(let i=0;i<point.length;i=i+5){
            await Promise.all(point.slice(i,Math.min(i+5,point.length)).map(_p=>{
                try{
                    fetchTimesByAxios(url+`lat=${_p.latitude}&lng=${_p.longitude}`,sunriseTimes,earliest,format)
                }catch(err){
                    console.log(err)
                }
            }))
            
        }
        const daylength=sunriseTimes.filter(_t=>moment(_t.results.sunrise,format).isSame(earliest[0]))
                                    .map(_el=>_el.results.day_length)
        res.status(200).send(daylength)
    }catch(err){
        console.log(err)
    }
}