/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import hashing from '../Scripts/hashing';
import sendM from '../hl7/sendM' ;
// import * as controller from './patientController';
import * as validate from '../Scripts/validation';
import validation from '../Scripts/validation';
const prisma = new PrismaClient();

//-----------------------Create Patient --------------------------------
export const createDiagnosis= async (req: Request, res: Response) => {
  const patient= req.body;
  try {
//     const patient = await prisma.user.findUnique({
//         where: {
//           userId: Data.id,
//           role: 'Patient',
//         }
//       });
       
      const msg=createMessageData(["ADT","A08"],patient);
       sendM(msg);
      res.status(201).json({ data:  patient });       // successsful response
    // } 
  } catch (error:any) {
    validate.handleErrors(error, res);
  } 
};

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
         sendM(msg);
        res.status(201).json({ data:  patient });       // successsful response
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
   
   adt.addSegment("PID",
   "", //Blank field
   ["","","", data.userId],
   "",
   );
   var pid = adt.getSegment("PID");
   if(messageType[0]=="ADT"){
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
    [data.userId, data.lastName,data.firstName, ]
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
