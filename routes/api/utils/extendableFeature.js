//resFromSunriseAPI: all results from sunrise-sunset api after its called

//sunrise-sunset API will return values for the following properties/fields
//"sunrise", "sunset",
//"solar_noon","day_length"
//"civil_twilight_begin","civil_twilight_end"
// "nautical_twilight_begin", "nautical_twilight_end",
//"astronomical_twilight_begin", "astronomical_twilight_end"
const moment = require('moment')

//criteria: either 0 or 1 - 0 represents minimum; 1 represents maximum
//(criteria,input,output)
//e.g. (0,'sunrise','day_length') will return list of day_length that have minimum (/earliest) sunrise 
//(1,'day_length','sunset') will return list of sunset that have maximum (/longest) day_length
exports.getMinMax = (criteria, input, output, resFromSunriseAPI, format) => {
    var limit
    resFromSunriseAPI.forEach(_res => { 
        if(input!='day_length'){
            const _resMoment = moment(_res[input], format)
            if(limit == undefined
                ||(criteria == 0 ? _resMoment.isBefore(limit) : _resMoment.isAfter(limit))){           
                limit=_resMoment                                        
            }
        }
        else{
            if(limit == undefined
                ||(criteria == 0 ? _res[input] < limit : _res[input] > limit)){           
                limit = _res[input]                                       
            }
        }
    })

    let resAfterProcessing = []
    resFromSunriseAPI.forEach(_el => {
        if(input != 'day_length' ? moment(_el[input], format).isSame(limit) : _el[input] == limit){
            resAfterProcessing.push(_el[output])
        }
    })
    /*Alternatively
    const resAfterProcessing=resFromSunriseAPI.filter(_el=>input!='day_length'?moment(_el[input],format).isSame(limit):_el[input]==limit)
                                            .map(_el=>{return _el[output]})
    */
    return resAfterProcessing
}



