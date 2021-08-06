const express=require('express')
const router=express.Router()
//const random=require('../helper')
const apiReq=require('request')
const axios=require('axios')
const {getDistance, getRandomLocations,getRandomGeo}=require('../helper_b')
const moment=require('moment')

router.get('/',async (req,res)=>{
    try{/*
        const url=process.env.API_ROOT.replace('<DATE>',process.env.date).replace('<FORMATTED>',process.env.formatted)
        const point=random(36.7201600,-4.4203400,80000,1)
        console.log(point.length)
        var data=[]
        //const sun=await Promise.all(point.map(async (_p,_index)=>{
        const sun=await point.map(async (_p,_index)=>{
            const newurl=url+`&lat=${_p.latitude}&lng=${_p.longitude}`;
            //var data
            console.log(newurl)
            await apiReq.get({url:newurl},async function(err,response,body){
                console.log(body)
                //return body //return data
                data.push(body)
                res.status(200).send(body)
                })
                //return data
            })*/
            //res.status(200).send(data) //res.status(200).send(sun)





            /*const newurl=url+`lat=${point[0].latitude}&lng=${point[0].longitude}`;
            console.log(newurl)
            var data
            await apiReq.get({url:newurl},function(err,res,body){
            //await apiReq({proxy:"http://localhost:9090",url:newurl,method:'GET'},function(err,res,body){
                console.log(body)
                //data=JSON.parse(body)
                })*/
                /*await axios.get({newurl,proxy:"http://localhost:9090"})
                .then(function (response){
                    data=response.data //(return) res.send?
                })
                .catch(function (error){
                    console.error('error!',error.message) //(return) res.status?
                })
                .finally(function (response){
                    
                })*/
                //res.status(200).send(data)
        

        
        
        //const url=process.env.API_ROOT.replace('<DATE>',process.env.date).replace('<FORMATTED>',process.env.formatted)
        /*var latitude, longitude;
        navigator.geolocation.getCurrentPosition(position => {
             latitude = position.coords.latitude;
             longitude = position.coords.longitude
            // Show a map centered at latitude / longitude.
          });
          console.log(latitude,longitude)
        const point=random(latitude,longitude,80000,2)*/
        //const point=getRandomLocations(36.7201600,-4.4203400,1000000000,101);//random(36.7201600,-4.4203400,80000,2)
        //const point=getRandomGeo(36.7201600,-4.4203400,1000000000,101);
        //const point=getRandomLocations(36.7201600,-4.4203400,5000,2)
        //const point=getRandomGeo(36.7201600,-4.4203400,5000,2);
        const date=req.query.date?req.query.date:process.env.DATE
        const formatted=req.query.formatted?req.query.formatted:process.env.FORMATTED//req.query.formatted||process.env.FORMATTED
        const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)
        const lat=(req.query.lat?req.query.lat:process.env.LAT)*1.0//(req.query.lat||process.env.LAT)*1.0
        const lng=(req.query.lng?req.query.lng:process.env.LON)*1.0//(req.query.lng||process.env.LON)*1.0
        const count=(req.query.count?req.query.count:process.env.COUNT)*1//(req.query.count||process.env.COUNT)*1.0
        const distance=(req.query.distance?req.query.distance:process.env.DISTANCE)*1.0//req.query.distance||process.env.DISTANCE
        //if(req.query.date)
        console.log(date," ",formatted," ",url, " ",lat," ",lng," ",distance, " ",count)
        const point=getRandomLocations(lat,lng,distance,count)
        //const point=getRandomGeo(lat,lng,distance,count);
        //const point=getRandomLocations(36.7201600,-4.4203400,distance,count)

        var data=[]; var y=[2];
        var verylongdata=[]
        for(let i=0;i<point.length;i=i+5){
            //const longdata=
            //await 
            //Promise.all(point.slice(i,Math.min(i+5,point.length)).map(async _p=>{
            const longdata=await Promise.all(point.slice(i,Math.min(i+5,point.length)).map(async _p=>{
                try{
                    //await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`,data,y)
                    //console.log(y)
                    //const item=await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`,data,y)
                    //console.log(item)
                    //return item
                    //return await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`,data,y)
                    //return await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`,data,y,(body)=>body)
                    //await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`,data,y,(body)=>console.log(body))
                    //await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`,(body)=>y.push(3))
                    //return await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`,(body)=>body)
                    //const item=await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`,(body)=>body)
                    //console.log(item)
                    //return item
                    //await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`,(body)=>{data.push(body);return data})//return await
                    //return data
                    //return await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`)//a
                    //await assistant2(url+`lat=${_p.latitude}&lng=${_p.longitude}`,data,res)//b
                    //const item=await assistant2(url+`lat=${_p.latitude}&lng=${_p.longitude}`,data)//b
                    //console.log(item);return item;//undefined
                    await assistant2(url+`lat=${_p.latitude}&lng=${_p.longitude}`,data)//b //return opt
                    //console.log(_p.latitude,_p.longitude,getDistance(36.7201600,-4.4203400,_p.latitude,_p.longitude))
                    console.log(_p.latitude,"    ",_p.longitude,"   ")
                    console.log(getDistance(lat,lng,_p.latitude,_p.longitude))
                    console.log(url+`lat=${_p.latitude}&lng=${_p.longitude}`)
                }catch(err){
                    console.error('how come?',err.message)
                }
            }))
            /*.then(results=>{
                results.forEach(element => {
                    verylongdata.push(element)
                });
            })*/
            //console.log(longdata.length) //a
            //longdata.forEach(element => verylongdata.push(element))//a
            //console.log(data.length)//b opt
            //console.log(y)
        }
        console.log(data.length)//b
        //res.status(200).send(JSON.stringify(data))//b
        res.status(200).send(data) //b
        //console.log(verylongdata.length)//a
        //res.status(200).send(longdata) //or verylongdata.push longdata; then send verylongdata; but push inline
        //res.status(200).send(verylongdata)//a
    }catch(err){
        console.log(err); //console.error('why?',err.message)
        res.status(500).send("something's wrong")
    }
})
//const assistant=async (url)=>{
//const assistant=async (url,cb)=>{
//const assistant=async (url,data,y,cb)=>{
    /*
    var res;
    const tool=await apiReq(url,function(err,res,body){
        //console.log('enhe ',body)
        //console.log('compl')
        //data.push(JSON.parse(body))
        //console.log(data)
       // y.push(3)
        //return body
        //cb(body)   //return cb(body)
        return res=cb(body)
    })
    //y.push(3)
    //return data
    //console.log(tool)
    //return tool
    //return res
    */
    const assistant=async (url)=>{ //const assistant=(url)=>{
    return new Promise((resolve, reject) => {
        apiReq({
           url,
           method: 'GET'
        },
        (err, res, body) => {
        if (err) { reject(err) }
        //call the resolve function which is passed to the executor                             //function passed to the promise
        resolve(JSON.parse(body))
        })
     })
}

const assistant2 =async (url,data,earlier)=>{
//const assistant2 =async (url,data,res)=>{
    //const tool=await axios.get(url)
    return await axios.get(url)
                .then(function (response){
                    //console.log(response.status)
                    //return response.status *10
                    //data.push(JSON.parse(response))
                    data.push(response.data) //data.push(response) //data.push(JSON.parse(response.data))
                    //const anw=response.data;console.log('anw ',anw,' result')
                    //res.status(202).json(anw) //below response undefined; 
                    //return res.status(202).json(anw)//if return, below response: header conext type json application 
                    //both postman o/p first anw
                    return response.data
                })
                .then(function (response){
                    //console.log('woho ',response,' jojo')
                    //return response
                    //const eletime=new Date(response.results.sunrise)
                    ////const eletime=Date.parse(response.results.sunrise)
                    //if(earlier.length==0) earlier.push(eletime)
                    //else if(eletime<earlier[0]) earlier[0]=eletime
                    //if(earlier[0]==undefined||eletime<earlier[0]) earlier[0]=eletime
                    const format='hh:mm:ss a'//'YYYY-MM-DDTHH:MM:SSZ'//'hh:mm:ss a' //'' for utc
                    const eletime=response.results.sunrise
                    console.log(eletime,moment(eletime,format))
                    if(earlier[0]==undefined||moment(eletime,format).isBefore(earlier[0])) earlier[0]=moment(eletime,format)
                })
                .catch(function (error){
                    console.error('error!',error.message) //(return) res.status?
                })
                .finally(function (response){
                    console.log('job done',response)
                })
    
    //console.log(tool); return tool;//undefined

}

router.post('/',async (req,res)=>{
    try{
        var earlier//=[]//='11:59:59 PM'
        const date=req.body&&req.body.date?req.body.date:process.env.DATE
        const formatted=(req.body&&req.body.formatted!=undefined&&req.body.formatted!=null?
            req.body.formatted:process.env.FORMATTED).toString()
            //date & formatted -> string; below number-> final type
        const url=process.env.API_ROOT.replace('<DATE>',date).replace('<FORMATTED>',formatted)
        const lat=(req.body&&req.body.lat?req.body.lat:process.env.LAT)*1.0
        const lng=(req.body&&req.body.lng?req.body.lng:process.env.LON)*1.0
        const count=(req.body&&req.body.count?req.body.count:process.env.COUNT)*1
        const distance=(req.body&&req.body.distance?req.body.distance:process.env.DISTANCE)*1.0
        console.log(req.body.date,' ',req.body.formatted,' ',req.body.distance,' ',req.body.lat,' ',req.body.lng,' ',req.body.count)
        console.log('post',date," ",formatted," ",url, " ",lat," ",lng," ",distance, " ",count)
        const point=getRandomLocations(lat,lng,distance,count)
        //const point=getRandomGeo(lat,lng,distance,count);
        /*var verylongdata=[]
        for(let i=0;i<point.length;i=i+5){
            const longdata=await Promise.all(point.slice(i,Math.min(i+5,point.length)).map(async _p=>{
                try{
                    return await assistant(url+`lat=${_p.latitude}&lng=${_p.longitude}`)
                }catch(err){
                    console.log(err)
                }
            }))
            longdata.forEach(element => {
                verylongdata.push(element);
                const eletime=new Date(element.results.sunrise)
                console.log(typeof (element.results.sunrise), eletime)
                if(earlier==undefined||eletime<earlier) earlier=eletime
            })
            //or await Promise.all().then(longdata=>longdata.forEach(element=>{}))
        }
        console.log(earlier.getTime())
        const daylength=verylongdata.filter(_el=>new Date(_el.results.sunrise).getTime()==earlier.getTime())//.map(_ele=>_ele.results.daylength)
        //res.status(200).send(verylongdata)
        console.log(daylength.length)
        res.status(200).send(daylength)*/

        var verylongdata=[]
        earlier=[];earlier.push(undefined)
        for(let i=0;i<point.length;i=i+5){
            await Promise.all(point.slice(i,Math.min(i+5,point.length)).map(async _p=>{
                try{
                    await assistant2(url+`lat=${_p.latitude}&lng=${_p.longitude}`,verylongdata,earlier)
                }catch(err){
                    console.log(err)
                }
            }))
            
        }
        console.log(earlier[0])
        //console.log(earlier[0],earlier[0].getTime())
        //const daylength=verylongdata.filter(_el=>new Date(_el.results.sunrise).getTime()==earlier[0].getTime())//.map(_ele=>_ele.results.day_length)
        //const daylength=verylongdata.filter(_el=>new Date(_el.results.sunrise)==earlier[0])//.map(_ele=>_ele.results.day_length)
        const format='hh:mm:ss a'//'YYYY-MM-DDTHH:MM:SSZ'//'hh:mm:ss a'//'' utc
        const daylength=verylongdata.filter(_el=>moment(_el.results.sunrise,format).isSame(earlier[0]))
        //res.status(200).send(verylongdata)
        console.log(daylength.length)
        //res.status(200).send({daylength,unit:formatted=='0'?'seconds':'hh:mm:ss'})
        res.status(200).send(daylength)
        
    }catch(err){
        console.log(err)
    }
})

module.exports=router