class CustomError extends Error {
    constructor(message, statusCode, status) {
      if(status=="INVALID_REQUEST") message+=" - Either lat or lng parameters are missing or invalid"
      if(status=="INVALID_DATE") message+=" - Date parameter is missing or invalid"
      if(status=="UNKNOWN_ERROR") message+=" - The request could not be processed due to a server error. Please try again later."
      super(message);
      //however if missing lat/lng or either is invalid, 
      //sunrise-sunset api will in fact NOT return "INVALID_REQUEST" status as it says in their api documentation
      //sunrise-sunset api will use lat=0 lng=0 as default --- thats also why lat=0 lng=0 used in my .env  as default

      this.statusCode = statusCode;
      this.status = status?status:(`${statusCode}`.startsWith('4') ? 'fail' : 'error');
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = CustomError;