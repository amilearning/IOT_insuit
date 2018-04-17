
'use strict';

var EventHubClient = require('azure-event-hubs').Client;
var Webcall = require('./apicall.js');

//feature_calculation calls python script to calculate features based on javascript
var PythonShell = require('python-shell');

function feature_calculation(accx,accy,accz,cb){
    var options = {
      mode: 'text',
      pythonOptions: ['-u'], // get print results in real-time
      args: [accx,accy,accz]
    };
    PythonShell.run('c_feats.py', options, function(err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      // console.log('results: %j', results);
      cb(results);
    });
}

// Close connection to IoT Hub.
IoTHubReaderClient.prototype.stopReadMessage = function() {
  this.iotHubClient.close();
}

// Read device-to-cloud messages from IoT Hub.
IoTHubReaderClient.prototype.startReadMessage = function(cb) {
  var printError = function(err) {
    console.error(err.message || err);
  };
  var printEvent = function (ehEvent) {
    console.log('Event Received: ');
    console.log(JSON.stringify(ehEvent.body));
    feature_calculation(ehEvent.body.accel_x,ehEvent.body.accel_y,ehEvent.body.accel_z,function(cal_features){
        var cal_features_float_array=cal_features.slice(1,cal_features.length-1).map(Number);
        // console.log(cal_features_float_array);
        //Input features to ML webapp
        let input_feature2={"input_df": [cal_features_float_array]};
        // console.log(input_feature2);
        //call machine learning service with input features , apicall.js used
        var apicall = new Webcall(input_feature2);
    });
    console.log('');

  };
  //Name of Device from IOThub (testdevice : simulated raspberri pi)
  var deviceId = 'testdevice';

  this.iotHubClient.open()
    .then(this.iotHubClient.getPartitionIds.bind(this.iotHubClient))
    .then(function(partitionIds) {
      return partitionIds.map(function(partitionId) {
        return this.iotHubClient.createReceiver(this.consumerGroupName, partitionId, {
          'startAfterTime': Date.now()
        })
        .then(function(receiver) {
          receiver.on('errorReceived', printError);
          receiver.on('message', printEvent);
        }.bind(this));
      }.bind(this));
    }.bind(this))
    .catch(printError);
}

function IoTHubReaderClient(connectionString, consumerGroupName) {
  this.iotHubClient = EventHubClient.fromConnectionString(connectionString);
  this.consumerGroupName = consumerGroupName;
}

module.exports = IoTHubReaderClient;
