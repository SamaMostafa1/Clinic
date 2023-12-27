import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';;

const prisma = new PrismaClient();

//-----------------------Create Patient --------------------------------

export const createPatient = async (req: Request, res: Response) => {
  const patientData = req.body;
  try {
    if(patientData.role!="Patient"){
      throw new Error('Invalid role or unmatched data');
    }else if(!patientData.gender || !patientData.firstName||!patientData.lastName
      ||!patientData.email||!patientData.phoneNumber||!patientData.role
      ||!patientData.password||!patientData.userName||!patientData. insurancePersentage
      ||!patientData.emergencyContact) {
      throw new Error('Missing required data');
    }else{
      const newPatient = await prisma.user.create({
        data: {
          ...patientData,
        },
      });
      // successsful response
      res.status(201).json({ data: newPatient });
    }
    
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

//-----------------------Update Patient --------------------------------

export const updatePatient = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const patientData = req.body;

  try {
    const updatedPatient = await prisma.user.update({
      where: {
        userId: parseInt(userId),
        role: 'Patient',
      },
      data: {
        ...patientData,
        role: 'Patient',
      }
    });

    res.status(200).json({ data: updatedPatient });
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
    }else{
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
  } finally {
    await prisma.$disconnect();
  }
};

//-----------------------Get Patient By ID --------------------------------

export const getPatientById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const patient = await prisma.user.findUnique({
      where: {
        userId: parseInt(userId),
        role: 'Patient',
      }
    });

    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
    } else {
      res.status(200).json({ data: patient });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};


//-----------------------Delete Patient --------------------------------

export const deletePatient = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await prisma.user.delete({
      where: {
        userId: parseInt(userId),
        role: 'Patient',
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};

