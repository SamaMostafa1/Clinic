/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const hl7 = require('simple-hl7');
var app = hl7.tcp();
const { PrismaClient } = require('@prisma/client');
const message = require('simple-hl7/lib/hl7/message');
const prisma = new PrismaClient();

app.use(function(req, res, next) {

  console.log("=================== Message Received ===================")
  console.log(req.msg.log());
  
  
  if (req.event == "A08" && req.type == "ADT"){
    const patientId = req.msg.getSegment('PID').getComponent(2, 4);
    const illnessDesc = req.msg.getSegment('DG1').getComponent(4, 1);
    const data = {
      "description": illnessDesc,
      "medicalHistoryId": patientId,
    };
    sendData(data);
    console.log("=================== Acknowledgment Sent ================")
    res.end();
  } else if (req.event == "A19" && req.type == "QRY"){

    const patientId = req.msg.getSegment('QRD').getComponent(8, 1);

    const newMsg = getPatientData(patientId,req.msg, res)

  }

  next();
});


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

async function getPatientData(patientId, msg,res) {
  
  try {
    const parsedUserId = parseInt(patientId);
      const data = await prisma.user.findUnique({
        where: {
          userId: parsedUserId,
          role: 'Patient',
        }
      });

      const diagnosis = await prisma.Illness.findMany({
        where: {
          medicalHistoryId: parsedUserId,
        }
      });
  msg.header.setField(7, ["ADR", "A19"])

  msg.addSegment("PID",
  "", //Blank field
  data.ssn,
  data.userId,
  "",
  [data.lastName, data.firstName],
  "",
  data.dateOfBirth,
  data.gender
  );


  diagnosis.forEach(diagnosis => {
    msg.addSegment("DG1",
      "", //Blank field
      "", //Multiple components
      "",
      diagnosis.description,
      "", //Date & Time
    );
  });

  res.ack = msg;
  // console.log("------------------------" + res.ack.log());
  res.end();
  console.log("=================== Acknowledgment Sent ================")

  return msg;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw error; 
  }
}


//Send Ack
// app.use(function(req, res, next) {
  // console.log('sending ack')
  // res.end();
  // // res.json({ data:"hiClient" }); 
// })


app.start(3888);
console.log('tcp interface listening on ' + 3888);
