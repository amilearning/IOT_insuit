const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const moment = require('moment');
const path = require('path');
const iotHubClient = require('./iot-hub.js');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res/*, next*/) {
  res.redirect('/');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  console.log("broadcast all")
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("websocket is open")
      try {
        console.log('sending data ' + data);
        client.send(data);
      } catch (e) {
        console.log("braodcast catch err")
        console.error(e);
      }
    }
    console.log("websocket is not open")

  });
};
//iothubClient(ConnectionString,consumergroupname) Connectionstring is the one from IOTHUB Shared access policies (iothubownder),
// consumergroupname can be found from IOTHUB endpoints->Event. 
var iotHubReader = new iotHubClient('HostName=hojinhubtest.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=L+GsbjFE2VIvhY3GlhHe5tRiC+2qs290pHtrQkP09i4=', 'testconsumergroups');
iotHubReader.startReadMessage(function (obj, date) {
  try {
    console.log("date ie")
    console.log(date);
    date = date || Date.now()
    wss.broadcast(JSON.stringify(Object.assign(obj, { time: moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') })));
  } catch (err) {
    console("catch err from startread")
    console.log(obj);
    console.error(err);
  }
});

var port = normalizePort(process.env.PORT || '3000');
server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
