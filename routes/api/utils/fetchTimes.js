const apiReq=require('request')
const axios=require('axios')
const moment=require('moment')
const CustomError=require('./customError')

//method 1: fetching data by request --- calling external spi by request
exports.fetchTimesByRequest= (url) => { //console.log(url) //async url
    return new Promise((resolve, reject) => {  //return await new promise
        apiReq({
            url,
            method: 'GET'
        },
        (err, res, body) => {
        if (err) { 
           // console.log('request err ',err);
            return reject(err)
            //throw new Error(`error in req ${err.message}, ${err.code}`) //similar
        }
        //else resolve(JSON.parse(body)) //if reject(err) above no return 
        resolve(JSON.parse(body))
        })
    })
}

//method 2: fetching data --- calling external api by axois; 
//and getting the earliest sunrise time
exports.fetchTimesByAxios = (url,sunriseData,earliest,format)=>{ //console.log(url)
    return axios.get(url)
                .then(function (response){
                    //sunriseData.push(response.data) //.results
                    //return response.data //.results
                    sunriseData.push(response.data.results) //.
                    console.log('1st then')
                    return response.data.results
                })
                .then(function (response){
                    //const sunrisetime=moment(response.results.sunrise,format) 
                    const sunrisetime=moment(response.sunrise,format)
                    console.log(response.sunrise,sunrisetime,earliest[0])
                    if(earliest[0]==undefined||sunrisetime.isBefore(earliest[0])) earliest[0]=sunrisetime
                    //sunriseData.push(sunrisetime)
                    //return new Error('test') //still success n go to finally
                    //throw new Error('test')

                    console.log('2nd then')
                })
                .catch(function (error){
                    console.error('error!',error.message)
                    //next(error) //but next not defined here
                    //throw new Error("inner error") //can catch test error
                    //return error //successful to finally

                    //throw new Error(error.response.data.status) //error.response.status=400//error.response.statusText='Bad Request'
                    //404 not found
                    //throw new Error(error.code) //if error.response==undefined
                    //throw new Error(error.message)  //if error.code undefined
                    throw new CustomError(
                        (error.response?error.response.statusText:'')+" - "+error.message,
                        error.response?error.response.status:500,
                        //error.response?(error.response.data&&error.response.data.status?error.response.data.status:error.response.statusText):''
                        error.response&&error.response.data&&error.response.data.status?error.response.data.status:undefined //null ''

                        )
                })
                .finally(function (response){
                    console.log('completed')
                })  
}