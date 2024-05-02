/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var hl7 = require('simple-hl7');
async function sendM(message) {
  var data = {};
  
  // Create a Promise to handle the asynchronous operation
  return new Promise((resolve, reject) => {
    // Server connection
    var client = hl7.Server.createTcpClient({
      host: '45.247.123.161',
      port: 3888,
      keepalive: true,
      callback: async function(err, ACK) {
        if (err) {
          console.log("*******ERROR********");
          console.log(err.message);
          reject(err); // Reject the Promise with the error
        } else {
          console.log(ACK.log() + "========= " );
          console.log("sssssssss",ACK.header.getComponent(7, 1).toString())
          console.log("sssssssssaaaaaa")
          if(ACK.header.getComponent(7, 1).toString()== "ADR"){
          var diagnosis = [] ;

          ACK.segments.forEach(segment =>  {
            console.log(segment.name);
            if (segment.name === 'DG1') {
              const description = segment.getComponent(4, 1);
              diagnosis.push(description);
              console.log("segmentttttt" , diagnosis)
            }
          });
          // Update the data object with the received information
          data = {
            "firstName": ACK.getSegment('PID').getComponent(5, 2),
            "lastName": ACK.getSegment('PID').getComponent(5, 1),
            "diagnosis": diagnosis

            
          };
          
          // Log the received data
          console.log("First Name:", data.firstName);
          console.log("Last Name:", data.lastName);
          console.log("Diagnosis:", data.diagnosis);

          // Log the received data
          console.log(data.firstName + "     " + data.lastName);

          resolve(data);
        }
        }
      }
    });

    var msg = message;

    console.log("message to be sent:   ", msg.log());
    console.log('************sending 1 message****************');

    // Send the message
    client.send(msg);
  });
}

module.exports = sendM;
