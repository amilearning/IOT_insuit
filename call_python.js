var PythonShell = require('python-shell');

//Not Using this script
//Not Using this script
//Not Using this script
//Not Using this script
//Not Using this script
//Not Using this script 
var options = {
  mode: 'text',
  // pythonPath: './',
  pythonOptions: ['-u'], // get print results in real-time
  // scriptPath: './',
  args: ['1,2,3','2,3,4','1,2,3']
};
PythonShell.run('c_feats.py', options, function(err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('results: %j', results);
  console.log(results[1])
});
