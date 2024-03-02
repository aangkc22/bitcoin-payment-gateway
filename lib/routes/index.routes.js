'use strict';

const express = require('express');
const router = express.Router();
// const commonServiceCtl = require('./common_service');

(() => {

  const bitcoin = require('./bitcoin/index.bitcoin.routes');
  router.use('/btc', bitcoin);

  const blockcypher = require('./blockcypher/index.blockcypher.routes');
  router.use('/blockcypher', blockcypher);

  const price_activity = require('./blockcypher/index.blockcypher.routes');
  router.use('/blockcypher', blockcypher);

  router.use('/health-check', (req, res, next) => {
    res.status(200);
    return res.json({
      status:200,
      message:"Ok"
    })
  })

  module.exports = router;
})();
