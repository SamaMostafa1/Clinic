import { Prisma } from '@prisma/client';
import { error } from 'console';
import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//-------------------Get All staff -----------------------

export const getAllstaff = async (req: Request, res: Response) => {

    try {
      const roleMembers = await prisma.user.findMany({
        where: {
          OR: [
            { role: "Doctor" },
            { role: "Admin" }
          ]
        }
      });
  
      res.status(200).json({ data: roleMembers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };

//-------------------Get  all staff User By ID-----------------------
export const getALLStaffById = async (req: Request, res: Response) => {
//   const getALLStaffById = async (req, res) => {
  const {userId} = req.params;
  try {
    console.log(userId);
    const userMember = await prisma.user.findUnique({
      where: {
        userId: parseInt(userId,10),
        OR: [
          { role: "Doctor" },
          { role: "Admin" }
        ]
      }
    });

    if (userMember) {
      res.status(200).json({ data: userMember });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};
//-------------------Get  all docotrs By clinicID-----------------------
export const getDoctorsByClinicID  = async (req: Request, res: Response) => {
//   const getDoctorsByClinicID = async (req, res) => {
    const {clinicId } = req.params;
    try {
      const userMember = await prisma.user.findMany({
        where: {
          clinicId : parseInt(clinicId),
          role: "Doctor",
        },
      });
      if ( (userMember.length === 0)) {
        res.status(404).json({ error: 'Invalid clinic  id' });
      } else {
        res.status(200).json({ data: userMember });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };
//-------------------Create New Staff -----------------------
export const createStaff = async (req: Request, res: Response) => {

  const userData = req.body;
  try {
    if(userData.role=="Patient"){
      throw new Error('Invalid role or unmatched data');
    }else if(!userData.gender || !userData.firstName||!userData.lastName
      ||!userData.email||!userData.phoneNumber||!userData.role
      ||!userData.password||!userData.userName) {
          throw new Error('Missing required data');
    }else{
      const newUser = await prisma.user.create({
        data: userData,
      });
      res.status(201).json({ data: newUser });
    }
    
  } catch (error:any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // uique value error
        const targetArray = error.meta?.target as string[]; // Type assertion
        if (targetArray && targetArray.includes('ssn')) {
          res.status(400).json({ error: 'SSN must be unique' });
        } else if (targetArray && targetArray.includes('userName')) {
          res.status(400).json({ error: 'Username must be unique' });
        } else {
          // Handle other Prisma known errors
          res.status(400).json({ error: 'Invalid request to the database' });
        }
    }
    }else if (error instanceof Prisma.PrismaClientValidationError) {
      // Handle validation errors
      res.status(422).json({ error: 'Validation error in database request' });
    }
    else if (error.message === 'Invalid role or unmatched data' ||error.message === 'Missing required data'){
      res.status(400).json({ error: error.message });
    }
    else{
    res.status(500).json({ error: 'Internal Server Error' });
    }
    
  } finally {
    await prisma.$disconnect();
  }
};

//-------------------Update staff-----------------------
export const updateStaff = async (req: Request, res: Response) => {
//   const updateUser = async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        userId: parseInt(userId),
       
      },
      
      data: userData,
    });
    res.status(200).json({ data: updatedUser });
  } catch (error:any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // uique value error
        const targetArray = error.meta?.target as string[]; // Type assertion
        if (targetArray && targetArray.includes('ssn')) {
          res.status(400).json({ error: 'SSN must be unique' });
        } else if (targetArray && targetArray.includes('userName')) {
          res.status(400).json({ error: 'Username must be unique' });
        } else {
          // Handle other Prisma known errors
          res.status(400).json({ error: 'Invalid request to the database' });
        }
    }
    }else if (error instanceof Prisma.PrismaClientValidationError) {
      // Handle validation errors
      res.status(422).json({ error: 'Validation error in database request' });
    }else{
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } finally {
    await prisma.$disconnect();
  }
};


//-------------------Delete Staff -----------------------
export const deleteStaff = async (req: Request, res: Response) => {
//  const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await prisma.user.delete({
      where: {
        userId: parseInt(userId, 10),
        OR: [
          { role: "Doctor" },
          { role: "Admin" }
        ]
      }
    });

    res.status(204).send(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};

