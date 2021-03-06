
'use strict';
var EventHubClient = require('azure-event-hubs').Client;
var Promise = require('bluebird');

// The Event Hubs SDK can also be used with an Azure IoT Hub connection string.
// In that case, the eventHubPath variable is not used and can be left undefined.
var connectionString = 'HostName=hojinhubtest.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=L+GsbjFE2VIvhY3GlhHe5tRiC+2qs290pHtrQkP09i4=';

var eventHubPath = '[Event Hub Path]';

var sendEvent = function (eventBody) {
  return function (sender) {
    console.log('Sending Event: ' + eventBody);
    return sender.send(eventBody);
  };
};

var printError = function (err) {
  console.error(err.message);
};

var printEvent = function (ehEvent) {
  console.log('Event Received: ');
  console.log(JSON.stringify(ehEvent.body));
  console.log('');
};

var client = EventHubClient.fromConnectionString(connectionString, eventHubPath);
var receiveAfterTime = Date.now() - 5000;

client.open()
      .then(client.getPartitionIds.bind(client))
      .then(function (partitionIds) {
        return Promise.map(partitionIds, function (partitionId) {
          return client.createReceiver('$Default', partitionId, { 'startAfterTime' : receiveAfterTime}).then(function(receiver) {
            receiver.on('errorReceived', printError);
            receiver.on('message', printEvent);
          });
        });
      })
      .then(function() {
        return client.createSender();
      })
      .then(sendEvent('foo'))
      .catch(printError);
