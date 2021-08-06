const apiReq=require('request')
const axios=require('axios')
const moment=require('moment')

//method 1: fetching data by request --- calling external spi by request
exports.fetchTimesByRequest= (url) => { 
    return new Promise((resolve, reject) => {
        apiReq({
            url,
            method: 'GET'
        },
        (err, res, body) => {
        if (err) { reject(err) }
        resolve(JSON.parse(body))
        })
    })
}

//method 2: fetching data --- calling external api by axois; 
//and getting the earliest sunrise time
exports.fetchTimesByAxios = (url,sunriseData,earliest,format)=>{
    return axios.get(url)
                .then(function (response){
                    //sunriseData.push(response.data) //.results
                    //return response.data //.results
                    sunriseData.push(response.data.results) //.results
                    return response.data.results
                })
                .then(function (response){
                    //const sunrisetime=moment(response.results.sunrise,format) 
                    const sunrisetime=moment(response.sunrise,format)
                    console.log(response.sunrise,sunrisetime,earliest[0])
                    if(earliest[0]==undefined||sunrisetime.isBefore(earliest[0])) earliest[0]=sunrisetime
                    //sunriseData.push(sunrisetime)
                })
                .catch(function (error){
                    console.error('error!',error.message)
                })
                .finally(function (response){
                    console.log('completed')
                })  
}