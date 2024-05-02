/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const hl7 = require('simple-hl7');
var app = hl7.tcp();

app.use(function(req, res, next) {

  console.log('Message:\n ' +   "\n" + req.msg.log());
  
  if (req.event == "A08" && req.type == "ADT"){
    console.log("ADTTTT");
    const patientId = req.msg.getSegment('PID').getComponent(2, 4);
    const illnessDesc = req.msg.getSegment('DG1').getComponent(4, 1);
    const data = {
      "description": illnessDesc,
      "medicalHistoryId": patientId,
    };
    sendData(data);
    console.log("ADTT END")
  } else if (req.event == "A19" && req.type == "QRY"){
    const patientId = req.msg.getSegment('PID').getComponent(2, 4);
    // patient = {
    //   "data": 2
    // }
    // const msg = createMessageData(["ADT","A08"],patient)
    console.log("sent " + msg.log());
    app.send(msg);
    console.log("Queryy")
  }
  // app.stop()
  next();
});


// app.use(function(req, res, next) {
//   const pidSegment = req.msg.getSegment('PID');
//   const pidJson = {};
//   pidSegment.fields.forEach((field, index) => {
//     pidJson[`field${index + 1}`] = field.value.join('|');
//   });

//   app.stop()
//   next();
// });


function sendData(data){
  fetch(`http://localhost:10000/EMR/patient/${data.medicalHistoryId}/illness`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('New illness created:', data);
  })
  .catch(error => {
    console.error('Error creating illness:', error);
  });
}


function createMessageData(messageType, data) {
  var hl7 = require('simple-hl7');
  var adt = new hl7.Message(
    "" ,
     "",
     "",
     "",
     "",
     "",
     messageType ,
 );
 
 adt.addSegment("PID",
 "", //Blank field
 ["","",""],
 "",
 );
 var pid = adt.getSegment("PID");
 if(messageType[0]=="ADT"){
  adt.addSegment("DG1",
  "", //Blank field
  "", //Multiple components
  "",
  "",
  "", //Date & Time
  );
 }else if(messageType[0]=="QRY"){
  adt.addSegment("QRD",
  "", //Blank field
  "", //Multiple components
  "",
  "",
  "", //Date & Time
  "",
  "",
  ["","sent" ]
  );
 }
//    else if(messageType[0]=="ACK"){
//     adt.addSegment("ACK",
//     "", //Blank field
//     "", //Multiple components
//     "",
//     "",
//     "", //Date & Time
//     "",
//     "",
//     [data.id,data.lastName,data.firstName, ]
//     );
//    }

 var parser = new hl7.Parser();
 var msg = parser.parse(adt.toString());
return msg;
}


//Send Ack
app.use(function(req, res, next) {
  // console.log('sending ack')
  res.end();
  // // res.json({ data:"hiClient" }); 
})


app.start(3888);
console.log('tcp interface listening on ' + 3888);
