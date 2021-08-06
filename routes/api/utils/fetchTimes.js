const moment=require('moment')

//method 1: fetching sunrise / sunset times by request
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

//method 2: fetching sunrise / sunset times by axois
exports.fetchTimesByAxios = (url,data,earliest,format)=>{
    return axios.get(url)
                .then(function (response){
                    data.push(response.data) 
                    return response.data
                })
                .then(function (response){
                    const sunrisetime=moment(response.results.sunrise,format)
                    if(earliest[0]==undefined||sunrisetime.isBefore(earliest[0])) earliest[0]=sunrisetime
                })
                .catch(function (error){
                    console.error('error!',error.message)
                })
                .finally(function (response){
                    console.log('completed')
                })  
}