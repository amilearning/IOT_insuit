# server.js
run " node server.js " from cmd for local runtime environment. 



Connection from IOTHUB to webapp(in node.js) 
Connectionstring for IOTHUB is in Shared access policies(used in server.js) . and click iothubowner.
Connectionstring for device (which is used in simulated device code) click IoTDevices and click testdevice.
Endpoints -> click Event under buit in endpoints Consumergroups - > testconsumergroups (used in server.js 

Iot-hub.js (receives data from IOThub) 

Monitoring data receiving from device to iothub(in local console /In_suit/Azure_ml/)
1.	Open cmd and run below
iothub-explorer monitor-events testdevice --login "IOTHUBconnectionstring"
2.	Open different cmd, and direct, and run node server.js
3.	Simulated divice can be found from 
https://azure-samples.github.io/raspberry-pi-web-simulator/#Getstarted
code for fake accel is wrote in Simulated raspberry pi code.txt in Azure_ml  folder (local)


Deploy model 
az ml env setup -n testmodelenv --location eastus2 –cluster (using remote cluster)
az ml env show -g testmodelenvrg -n testmodelenv
 
az ml account modelmanagement set -n iotmodel -g iotmlrg
az ml env set -g iotenvrg -n iotenv
az ml env show 

one line deployment
az ml service create realtime -f score_v3.py --model-file sgd_automated_learn_v2.pkl -s sgd_automated_learn_v2.json -n iotv2app -r python --collect-model-data true -c aml_config\conda_dependencies.yml


Python code to call iotapp 
def call_iotapp(data):
    body = str.encode(json.dumps(data))

    url = 'http://52.177.184.146/api/v1/service/iotapp/score'
    api_key = ''
    headers = {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + api_key)}
    resp = requests.post(url, data, headers=headers)
    return resp.text



Setting IOTHUB . Connect Device, Connect Webapp, Check Machinelearning app url, and apikey. 
 




