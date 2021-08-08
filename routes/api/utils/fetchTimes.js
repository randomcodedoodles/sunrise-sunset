const apiReq = require('request')
const axios = require('axios')
const moment = require('moment')
const CustomError = require('./customError')

//method 1: fetching data by request --- calling external spi by request
exports.fetchTimesByRequest = (url) => { 
    return new Promise((resolve, reject) => { 
        apiReq({
            url,
            method: 'GET'
        },
        (err, res, body) => {
        if (err) { 
            return reject(err)
        }
        resolve(JSON.parse(body))
        })
    })
}

//method 2: fetching data --- calling external api by axois; 
//and getting the earliest sunrise time
const fetchTimesByAxiosHelper = (url, sunriseData, earliest, format) => {
    return axios.get(url)
                .then(function (response){
                    sunriseData.push(response.data.results) 
                    return response.data.results
                })
                .then(function (response){ //find earliest sunrise time
                    const sunrisetime=moment(response.sunrise,format)
                    if(earliest[0] == undefined || sunrisetime.isBefore(earliest[0])) earliest[0]=sunrisetime
                })
                .catch(function (error){
                    //console.error(error.message)
                    throw new CustomError(
                        (error.response ? error.response.statusText : '') + " - " + error.message,
                        error.response ? error.response.status : 500,
                        error.response && error.response.data && error.response.data.status ? error.response.data.status : undefined 
                        )
                })
}

exports.fetchTimesByAxios = async (_p, url, sunriseTimes, earliest, format) => {
    try{
        await fetchTimesByAxiosHelper(url+`lat=${_p.latitude}&lng=${_p.longitude}`, sunriseTimes, earliest, format)
    }catch(err){
        throw new CustomError(err.message, err.statusCode, err.status)
    }
}