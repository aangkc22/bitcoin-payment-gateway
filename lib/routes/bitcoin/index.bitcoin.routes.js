'use strict';

const { json } = require('express');

// const commonServiceCtl = require('./common_service');

(() => {
  const express = require('express');
  const router = express.Router();
  
  const bitcoin_modules = require('../../modules/bitcoin/index.btc.module');
  const cryptography = require('../../common_helpers/cryptography');


  const generateAddress = async(req,res,next)=> {
    const body = req.body;
    const address_type = body.address_type;
    if (address_type == 'p2pkh'){
      await bitcoin_modules.generate_address.p2pkh(req,res,next)
    }else if(address_type == 'hd'){
       await bitcoin_modules.generate_address.hdAddress(req,res,next);
      }else{ 
        console.log(" invalid address type");
    }
  }

  const forwardBtc = async(req, res, next) => {
    try {
        const body = JSON.parse(req.body.data);
        console.log(body);
        const forward_type = body.forward_type;
        if (forward_type === 'blockcypher'){
          await bitcoin_modules.blockcypher_forward_btc(req, res, next)

        }
        else{
          console.log('Only blockcypher forward balance is valid for now')
          // await bitcoin_modules.forward_btc(req, res, next)

        }
      
    } catch (error) {
      console.log(error)
      res.status(400).json({ msg: error }); 
    }
  }


  const btcCryptoGraphy = async(req,res,next)=> {
    const body = req.body;
    const mnemonic = body.mnemonic;

    const encryptedKey = await cryptography.encryptAES(mnemonic)
    
    res.status(200).json({encryptedKey: encryptedKey});



  }

  const validateAddress = async(req,res,next)=> {
       await bitcoin_modules.validate_address(req, res, next)
    }

  router.post('/generate_address', generateAddress);
  router.post('/forward_btc', forwardBtc);
  router.post('/validate_address', validateAddress);
  router.post('/encrypt', btcCryptoGraphy);
  

  router.use('/health-check', (req, res, next) => {
    res.status(200);
    return res.json({
      status:200,
      message:"Ok"
    })
  })

  module.exports = router;
})();
