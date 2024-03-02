'use strict';

// const commonServiceCtl = require('./common_service');

(() => {
  const express = require('express');
  const router = express.Router();
  
  const blockcypher_modules = require('../../modules/blockcypher/index.blockcypher.module');



  const webhook = async(req, res, next) => {
     blockcypher_modules.webhook(req, res, next);
     return res.status(200).json({ "sucess" : true});
  }

  router.post('/webhook', webhook);
  

  router.use('/health-check', (req, res, next) => {
    res.status(200);
    return res.json({
      status:200,
      message:"Ok"
    })
  })

  module.exports = router;
})();
