var hl7 = require('simple-hl7');
 function sendM(message) {
 //server connnection
var client = hl7.Server.createTcpClient({
  // host: '45.247.27.11',
  host: '127.0.0.1',
  port: 3888,
  keepalive: true,
  callback: function(err, ACK) {
    if (err) {
      console.log("*******ERROR********");
      console.log(err.message);
    } else {
      console.log(ACK.log());
      // if(data=="hiClient"){
        // client.send(msg);
      // }
    }
  }
});

var msg = message

console.log("message to be sent:   ",msg.log());
console.log('************sending 1 message****************');

// client.send("Hi");
client.send(msg);
}

module.exports = sendM;