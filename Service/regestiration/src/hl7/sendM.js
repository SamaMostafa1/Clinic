/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var hl7 = require('simple-hl7');
async function sendM(message) {
  var data = {};
  
  // Create a Promise to handle the asynchronous operation
  return new Promise((resolve, reject) => {
    // Server connection
    var client = hl7.Server.createTcpClient({
      // host: '45.247.123.161',
      host: '127.0.0.1',
      port: 3888,
      keepalive: true,
      callback: async function(err, ACK) {
        if (err) {
          console.log("*******ERROR********");
          console.log(err.message);
          reject(err); // Reject the Promise with the error
        } else {
          console.log("=================== Acknowledgment Message ===================")
          console.log(ACK.log());
          if(ACK.header.getComponent(7, 1).toString()== "ADR"){
          var diagnosis = [] ;

          ACK.segments.forEach(segment =>  {
            if (segment.name === 'DG1') {
              const description = segment.getComponent(4, 1);
              diagnosis.push(description);
            }
          });
          // Update the data object with the received information
          data = {
            "firstName": ACK.getSegment('PID').getComponent(5, 2),
            "lastName": ACK.getSegment('PID').getComponent(5, 1),
            "diagnosis": diagnosis
          };


          resolve(data);
        }
        }
      }
    });

    var msg = message;

    console.log("=================== Sending 1 message ===================")
    console.log(msg.log());
    // console.log('************Sending 1 message****************');

    // Send the message
    client.send(msg);
  });
}

module.exports = sendM;
