'use strict';

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(process.cwd(), '.env') });
if (dotenv.error) {
  console.log('=---dotenv.error---=', dotenv.error);
  throw dotenv.error;
}

const app = express();
const indexRouter = require('./lib/routes/index.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   // req.metaData = {
//   //   debugId: uuid(),
//   //   deviceId: req.headers.deviceid,
//   //   ip: req.ip,
//   //   'user-agent': req.headers['user-agent'],
//   //   token: req.headers['x-access-token'] || req.headers.authorization,
//   //   channel: req.headers.channel,
//   //   'context-service': 'api-customer',
//   //   'context-method': req.baseUrl + req.url,
//   // };
//   next();
// });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization,x-access-token,Accept');
  // Set cache control header to eliminate cookies from cache
  res.setHeader('Cache-Control', 'no-cache="Set-Cookie, Set-Cookie2"');
  next();
});

app.get('/', (req, res, next) => {
  console.log(req.env);
  res.send('BIS PAYMENT GATEWAY RUNNING');
});

app.use('/api', indexRouter);

module.exports = app;
