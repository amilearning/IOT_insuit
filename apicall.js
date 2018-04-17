// example request to remote API

 const req = require("request");
 const uri = "http://52.232.178.71/api/v1/service/iotv2app/score";
 const apikey = "";
// example input format
 let test_data =  {"input_df": [[1,2,3,4,5,6,7,8,9,10,11,12]]}


// console.log(test_data)
function request_to_ml_service(input_data){
    var options = {
         uri:uri,
         method: "POST",
         headers: {
             "Content-Type": "application/json",
             "Authorization": "Bearer " + apikey,
         },

         body: JSON.stringify(input_data)
     }

     req(options, (err,res,body) => {
         if (!err && res.statusCode ==200){
             console.log("yhea we got a response from Server")
             console.log(body);
         } else{
             console.log("Opps, sorry here what went wrong, statuscode is")
             console.log(res.statusCode);
         }
     });
}

module.exports = request_to_ml_service;
