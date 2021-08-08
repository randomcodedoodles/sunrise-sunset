const express = require('express')
const router = express.Router()
const sunriseController = require('./sunriseController')

router
  .route('/')
  .get(sunriseController.getDayLengthByUrl)
  .post(sunriseController.getDayLengthByPost);

module.exports=router