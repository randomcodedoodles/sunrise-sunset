class CustomError extends Error {
    constructor(message, statusCode, status) {
      //super(message);
      /*var tailoredMsg
      if(message=="INVALID_REQUEST") tailoredMsg="Either lat or lng parameters are missing or invalid"
      if(message=="INVALID_DATE") tailoredMsg="Date parameter is missing or invalid"
      if(message=="UNKNOWN_ERROR") tailoredMsg="The request could not be processed due to a server error. Please try again later."
      super(tailoredMsg);*/
      /*
      if(message=="INVALID_REQUEST") message+=" - Either lat or lng parameters are missing or invalid"
      if(message=="INVALID_DATE") message+=" - Date parameter is missing or invalid"
      if(message=="UNKNOWN_ERROR") message+=" - The request could not be processed due to a server error. Please try again later."
      super(message);*/

      if(status=="INVALID_REQUEST") message+=" - Either lat or lng parameters are missing or invalid"
      if(status=="INVALID_DATE") message+=" - Date parameter is missing or invalid"
      if(status=="UNKNOWN_ERROR") message+=" - The request could not be processed due to a server error. Please try again later."
      super(message);


      this.statusCode = statusCode;
      //this.status = (status!=''?status: (`${statusCode}`.startsWith('4') ? 'fail' : 'error'));
      //this.status = status + `${statusCode}`.startsWith('4') ? ' - fail' : ' - error';
      //console.log('status in custum error ',status)
      this.status = status?status:(`${statusCode}`.startsWith('4') ? 'fail' : 'error');
      //this.status = (status?(status+' '):'')+(`${statusCode}`.startsWith('4') ? 'fail' : 'error');
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = CustomError;