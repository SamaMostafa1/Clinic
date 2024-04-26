import { Prisma } from '@prisma/client';
import { error } from 'console';
import { Request, Response } from 'express';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



//-------------------Get  all staff User By ID-----------------------
export const getRecordByPatientId = async (req: Request, res: Response) => {
  const { patientId  } = req.params;
  try {
    const parsedpatientId = parseInt( patientId );
    if (isNaN(parsedpatientId)) {
      throw new Error('Invalid userId format. Must be an integer.');
    }
    const EMR = await prisma.EMR.findMany({
      where: {
        patientId: parsedpatientId,
      }
    });
    if (EMR) {
      res.status(200).json({ data: EMR });
    } else {
      res.status(404).json({ error: 'EMR not found' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
};


//-------------------Create New Staff -----------------------
export const createRecord = async (req: Request, res: Response) => {
  const EMRData = req.body;
  try {
      const newEMR = await prisma.EMR.create({
        data: EMRData,
      });
      res.status(201).json({ data: newEMR });
    } 
  catch (error:any) {
  } finally {
    await prisma.$disconnect();
  }
};
// //-------------------Update staff-----------------------
// export const updateStaff = async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   const userData = req.body;
//   const parsedUserId=parseInt(userId);
//   try { 
//     if(isNaN(parsedUserId)){
//       throw new Error('Data type must be integer');
//     }
//       const userExists = await prisma.user.findUnique({
//         where: {
//           userId: parsedUserId,
//           OR: [
//             { role: "Doctor" },
//             { role: "Admin" }
//           ],
//         },
//       });  
//       if (!userExists) {
//         throw new Error('User not found');
//       }else{

//         await validation.validateUsertData(userData)
//         const updatedUser = await prisma.user.update({
//           where: {
//             userId: parsedUserId,
//             OR: [
//               { role: "Doctor" },
//               { role: "Admin" }
//             ],  
//           },    
//           data: userData,
//         }); 
//         res.status(200).json({ data: updatedUser });  
//     }
//   } catch (error:any) {
//     validate.handleErrors(error, res);
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// //-------------------Delete Staff -----------------------
// export const deleteStaff = async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   try {
//     await prisma.user.delete({
//       where: {
//         userId: parseInt(userId, 10),
//         OR: [
//           { role: "Doctor" },
//           { role: "Admin" }
//         ]
//       }
//     });

//     res.status(204).send(); 
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//     await prisma.$disconnect();
//   }
// };

