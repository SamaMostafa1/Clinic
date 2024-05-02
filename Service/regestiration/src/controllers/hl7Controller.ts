/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import hashing from '../Scripts/hashing';
import sendM from '../hl7/sendM' ;
// import * as controller from './patientController';
import * as validate from '../Scripts/validation';
import validation from '../Scripts/validation';
var hl7 = require('simple-hl7');
const prisma = new PrismaClient();

//-----------------------Create Patient --------------------------------
export const createDiagnosis= async (req: Request, res: Response) => {
  const patient= req.body;
  try {
    // const patient = await prisma.user.findUnique({
    //     where: {
    //       userId: Data.id,
    //       role: 'Patient',
    //     }
    //   });
       
      const msg=createMessageData(["ADT","A08"],patient);
       sendM(msg);
      res.status(201).json({ data:  patient });       // successsful response
    // } 
  } catch (error:any) {
    validate.handleErrors(error, res);
  } 
};

async function fetchData(message:any) {
  try {
    const data = await sendM(message);
    // console.log("Received data:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const getPatientInfo= async (req: Request, res: Response) => {
    const { userId } = req.params;
    const parsedUserId = parseInt(userId);
    try {
      const patient = await prisma.user.findUnique({
          where: {
            userId: parsedUserId,
            role: 'Patient',
          }
        });      
        const msg=createMessageData(["QRY","A19"],patient);
        var data = await fetchData(msg)

        res.status(201).json({ data: data   });       // successsful response
      // } 
    } catch (error:any) {
      validate.handleErrors(error, res);
    } 
  };

function createMessageData(messageType:any,data:any,) {
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
   
   
   if(messageType[0]=="ADT"){
    adt.addSegment("PID",
   "", //Blank field
   ["","","", data.userId],
   "",
   );
  //  var pid = adt.getSegment("PID");
    adt.addSegment("DG1",
    "", //Blank field
    "", //Multiple components
    "",
    data.diagnosis,
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
    [data.userId ]
    );
   }
 
   var parser = new hl7.Parser();
   var msg = parser.parse(adt.toString());
 return msg;
}
