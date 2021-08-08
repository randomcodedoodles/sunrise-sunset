
const CustomError = require('./customError')

exports.parseLatLon = function (latLon, paramName, lowerBound, upperBound, queryOrBody, NEXT) {
    let parsed;
    if(latLon) parsed = parseFloat(latLon);
    if(queryOrBody == 'GET'){
        if (!latLon || isNaN(latLon) || isNaN(parsed) || parsed < lowerBound || parsed > upperBound) {
            throw new CustomError(`Invalid ${paramName}`, 400);
        }
    }
    else if (queryOrBody == 'POST'){
        if (!latLon || typeof latLon != 'number' || parsed < lowerBound || parsed > upperBound) {
            throw new CustomError(`Invalid ${paramName}`, 400);
        }
    }
    return parsed;
}


