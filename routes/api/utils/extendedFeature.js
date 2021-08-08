//resFromSunriseAPI: all results from sunrise-sunset api after its called

//sunrise-sunset API will return values for the following properties/fields
//"sunrise", "sunset",
//"solar_noon","day_length"
//"civil_twilight_begin","civil_twilight_end"
// "nautical_twilight_begin", "nautical_twilight_end",
//"astronomical_twilight_begin", "astronomical_twilight_end"
const moment=require('moment')

//criteria: either 0 or 1 - 0 represents minimum; 1 represents maximum
//(criteria,input,output)
//e.g. (0,'sunrise','day_length') will return list of day_length that have minimum (/earliest) sunrise 
//(1,'day_length','sunset') will return list of sunset that have maximum (/longest) day_length
exports.getMinMax=(criteria,input,output,resFromSunriseAPI,format)=>{
    var limit
    resFromSunriseAPI.forEach(_res=>{ console.log(_res.sunrise,_res.sunset,_res.day_length)
        if(input!='day_length'){
            const _resMoment=moment(_res[input],format)
            if(limit==undefined
                ||(criteria==0?_resMoment.isBefore(limit):_resMoment.isAfter(limit))){           
                limit=_resMoment                                        
            }
        }
        else{
            if(limit==undefined
                ||(criteria==0?_res[input]<limit:_res[input]>limit)){           
                limit=_res[input]                                       
            }
        }
    })
    console.log('5:38:40'<'12:35:29','05:38:40'<'12:35:29',moment('5:38:40','hh:mm:ss').isBefore(moment('12:38:40','hh:mm:ss')),
    moment('5:38:40','hh:mm:ss').isSame(moment('05:38:40','hh:mm:ss')),
    moment('5:38:40','hh:mm:ss a').isSame(moment('05:38:40','hh:mm:ss a')),
    moment('5:38:40','hh:mm:ss a').isBefore(moment('12:38:40','hh:mm:ss a')),
    moment('5:38:40 AM','hh:mm:ss a').isBefore(moment('12:38:40 AM','hh:mm:ss a')),
    moment('5:38:40 AM','hh:mm:ss a').isBefore(moment('12:38:40 PM','hh:mm:ss a')),
    moment('5:38:40 PM','hh:mm:ss a').isBefore(moment('12:38:40 AM','hh:mm:ss a')),
    moment('5:38:40 PM','hh:mm:ss a').isBefore(moment('12:38:40 PM','hh:mm:ss a')),
    '78676'<'89786','78676'*1<'89786'*1,resFromSunriseAPI[0].day_length<resFromSunriseAPI[1].day_length,
    resFromSunriseAPI[0].day_length==resFromSunriseAPI[1].day_length,
    typeof resFromSunriseAPI[0].day_length, typeof resFromSunriseAPI[0].sunrise,
    moment('2:38','hh:mm:ss a').isBefore(moment('05:38:40','hh:mm:ss a')),
    moment('2:38','hh:mm:ss a').isBefore(moment('5:38:40','hh:mm:ss a')),
    moment('2:8','hh:mm:ss a').isBefore(moment('05:38:40','hh:mm:ss a')), //2.8 //2.85 false //2.08
    moment('2:00','hh:mm:ss a').isBefore(moment('05:38:40','hh:mm:ss a')),//2:0 //2:00 /2:08
    moment('2:0','hh:mm:ss a').isBefore(moment('05:38:40','hh:mm:ss a')), //2 //2:0
    moment('2','hh:mm:ss a').isBefore(moment('05:38:40','hh:mm:ss a')),
    moment('2:3:3 AM','hh:mm:ss a').isSame(moment('2:03:03 AM','hh:mm:ss a')),
    moment('2:3:3 AM','hh:mm:ss a').isSame(moment('02:03:03 AM','hh:mm:ss a')),
    moment('2:3 AM','hh:mm:ss a').isSame(moment('2:03:00 AM','hh:mm:ss a')),
    moment('2:3 AM','hh:mm:ss a').isSame(moment('02:03:00 AM','hh:mm:ss a')),
    moment('2 AM','hh:mm:ss a').isSame(moment('02:00:00 AM','hh:mm:ss a')),
    moment('4:13:23 AM','hh:mm:ss a').isBefore(moment('12:31:32 am','hh:mm:ss a')),
    moment('4:13:23 AM','hh:mm:ss a').isBefore(moment('12:31:32 pm','hh:mm:ss a')),
    moment('4:13:23 pm','hh:mm:ss a').isBefore(moment('12:31:32 PM','hh:mm:ss a')),
    moment('4:13:23 pm','hh:mm:ss a').isBefore(moment('12:31:32 AM','hh:mm:ss a')))
    //moment({}).duration(433276000), moment({}).duration(433276000).format('hh:mm:ss'),
    //moment({}).duration(433276000).asHours(),moment({}).duration(433276000).asMinutes(),
    //moment({}).duration(433276000).hours(),moment({}).duration(433276000).minutes(),
    
    const temp=moment({}).second(433276000).format('hh:mm:ss')
    console.log('1: ',temp, typeof temp)//temp.isBefore(moment('9:4','hh:mm:ss a'))
    console.log(moment('09:27:40','hh:mm:ss a').isBefore(moment('9:4','hh:mm:ss a')),//!
                moment('9:4','hh:mm:ss a').isAfter(moment('09:27:40','hh:mm:ss a')),//!
                moment('09:27:40','hh:mm:ss a').isAfter(moment('09:04','hh:mm:ss a')),
                moment('9:4','hh:mm:ss a').isBefore(moment('9:27:40','hh:mm:ss a')))//!
    const temp2=new Date(433276 * 1000).toISOString().substr(11, 8)
    console.log(temp2)//temp2,moment('9:4','hh:mm:ss a').isBefore(temp2) //moment(temp2).isBefore(moment('9:4','hh:mm:ss a'))
    console.log(new Date(5678 * 1000).toISOString().substr(11, 8),moment({}).second(5678).format('hh:mm:ss'))
    console.log(new Date(86399 * 1000).toISOString().substr(11, 8))
    console.log(moment('9:4','hh:mm:ss'),moment('9:4','hh:mm:ss').format('hh:mm:ss'),moment({}).second(5678))
    //moment({}).second(5678),moment().startOfDay('day').second(5678)
    console.log(new Date(86401 * 1000).toISOString().substr(11, 8))
    console.log(moment(new Date(86401 * 1000).toISOString().substr(11, 8),'hh:mm:ss'))//.isSame(moment('0:0','hh:mm:ss a'))
    console.log(moment(new Date(86401 * 1000).toISOString().substr(11, 8),'hh:mm:ss').isSame(moment('00:00:00','hh:mm:ss a')))
    console.log(moment(new Date(86401 * 1000).toISOString().substr(11, 8),'hh:mm:ss').isAfter(moment('0:0','hh:mm:ss a')))
    console.log(new Date(86401 * 1000).toISOString().substr(11, 8)=='00:00:00')
    console.log(new Date(86401 * 1000).toISOString().substr(11, 8)=='0:0')
    console.log(new Date(86401 * 1000).toISOString().substr(11, 8)=='0')

    var resAfterProcessing=[]
    resFromSunriseAPI.forEach(_el=>{
        if(input!='day_length'?moment(_el[input],format).isSame(limit):_el[input]==limit){
            resAfterProcessing.push(_el[output])
        }
    })
    /*Alternatively
    const resAfterProcessing=resFromSunriseAPI.filter(_el=>input!='day_length'?moment(_el[input],format).isSame(limit):_el[input]==limit)
                                            .map(_el=>{return _el[output]})
    */
    return resAfterProcessing
}



//min & max --- in the form of 'hh:mm:ss AM' or 'h:mm:ss PM' or 'hh:m:ss am' or 'hh:mm:ss pm' etc for non 'day_length' input 
//or in the form of 'hh:mm:ss' or 'h:mm:ss' or 'h:mm' or 'h:m' or 'h' or 'hh:m' or 'hh' etc if input=='day_length'
exports.getInBetween = (min, max, input, output, resFromSunriseAPI, format) => {
    var resAfterProcessing=[]
    var formatMin, formatMax
    if(!isNaN(min)&&!isNaN(parseFloat(min))) formatMin = new Date(min * 1000).toISOString().substr(11, 8) //convert seconds to hh:mm:ss
    if(!isNaN(max)&&!isNaN(parseFloat(max))) formatMax = new Date(max * 1000).toISOString().substr(11, 8) //convert seconds to hh:mm:ss
    resFromSunriseAPI.forEach(_el=>{ /*
        if(input!='day_length' && moment(_el[input],format).isSameOrAfter(min) && moment(_el[input],format).isSameOrBefore(max)){
            resAfterProcessing.push(_el[output])
        }
        */
        if(input!='day_length' ){

        }
        else if(format='hh:mm:ss a')
    })
    return resAfterProcessing
}