'use strict';
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 4000;
const server = http.createServer(app);
app.set('PORT_NUMBER', port);

server.listen(port, () => {
    console.log(`BIS Payment Gateway started on port ${port} at Date ${new Date()}`);
});

server.on('error', onError);

function onError (error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        // eslint-disable-next-line no-unreachable
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        // eslint-disable-next-line no-unreachable
        break;
      default:
        throw error;
    }
}
  

module.exports = server;



