/* eslint-disable @typescript-eslint/no-var-requires */
import { Prisma } from '@prisma/client';
import { error } from 'console';
import { Request, Response } from 'express';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//================================================drugs===============================================

export const getDrugsByPatientId= async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);

  try {
    const patientDrugs = await prisma.drug.findMany({
      where: {
        medicalHistoryId: patientId, 
      }, select: {
        name: true, 
      },
    });    
    res.json(patientDrugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createDrugs= async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);
  const drugs= req.body;
  console.log("drug body");
 console.log(drugs);
  try {
      createMedicalHistoryIfNotExists(patientId);
      const createdDrugs = await prisma.drug.create({
        data: {
          ...drugs,
          medicalHistoryId: patientId,
        },
      });

      res.status(201).json({ data: createdDrugs});       
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const deleteDrug = async (req: Request, res: Response) => {
  const drugId = parseInt(req.params.id);

  try {
    const existingDrug = await prisma.drug.findUnique({
      where: {
        id: drugId,
      },
    });

    if (!existingDrug) {
      return res.status(404).json({ error: 'Drug not found' });
    }
    await prisma.drug.delete({
      where: {
        id: drugId,
      },
    });

    res.status(200).json({ message: 'Drug deleted successfully' });
  } catch (error) {
    console.error('Error deleting drug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//==================================================record================================================

export const createRecord = async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);
  try {
    const record= req.body;
    const newRecord = await prisma.record.create({
      data: {
        ...record,
        medicalHistoryId:patientId
      },
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecordByPatientId = async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);

  try {
    const record = await prisma.record.findMany({
      where: {
        medicalHistoryId: patientId,
      },
    });

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const deleteRecordById = async (req: Request, res: Response) => {
  const recordId = parseInt(req.params.id);

  try {
    await prisma.record.delete({
      where: {
        id: recordId,
      },
    });

    res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//=================================================Test==================================================

export const createMedicalTest = async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);
  try {
    const data = req.body;
    console.log(data);
    const newMedicalTest = await prisma.medicalTest.create({
      data: {
        ...data,
        medicalHistoryId:patientId,
      },
    });
    res.status(201).json(newMedicalTest);
  } catch (error) {
    console.error('Error creating medical test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMedicalTestByPatientId = async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);

  try {
    const medicalTests = await prisma.medicalTest.findMany({
      where: {
        medicalHistoryId: patientId,
      }, select: {
        description: true,
      },
    });
    console.log(medicalTests);

    res.json(medicalTests);
  } catch (error) {
    console.error('Error fetching medical test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMedicalTestById = async (req: Request, res: Response) => {
  const medicalTestId = parseInt(req.params.id);

  try {
    await prisma.medicalTest.delete({
      where: {
        id: medicalTestId,
      },
    });

    res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting medical test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//==========================================operations================================================

export const createOperation = async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);

  try {
    const data = req.body;

    const newOperation = await prisma.operation.create({
      data: {
       ...data,
        medicalHistoryId:patientId,
      },
    });

    res.status(201).json(newOperation);
  } catch (error) {
    console.error('Error creating operation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getOperationByPatientId = async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);

  try {
    const operations = await prisma.operation.findMany({
      where: {
        medicalHistoryId: patientId,
      },select: {
        name: true,
      },
    });
    res.json(operations);
  } catch (error) {
    console.error('Error fetching operation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const deleteOperationById = async (req: Request, res: Response) => {
  const operationId = parseInt(req.params.id);

  try {
    await prisma.operation.delete({
      where: {
        id: operationId,
      },
    });
    res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting operation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//=======================================illness==========================================================
export const createIllness = async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);
  try {
    const data = req.body;

    const newIllness = await prisma.illness.create({
      data: {
        ...data,
        medicalHistoryId:patientId,
      },
    });
    res.status(201).json(newIllness);
  } catch (error) {
    console.error('Error creating illness:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const getIllnessByPatientId = async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);

  try {
    const illness = await prisma.illness.findMany({
      where: {
        medicalHistoryId: patientId,
      },
    });

    res.json(illness);
  } catch (error) {
    console.error('Error fetching illness:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const deleteIllnessById = async (req: Request, res: Response) => {
  const illnessId = parseInt(req.params.id);

  try {
    await prisma.illness.delete({
      where: {
        id: illnessId,
      },
    });

    res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting illness:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//========================================================================================================
async function createMedicalHistoryIfNotExists(patientId: number) {
  // Check if a medical history record with the provided patient ID exists
  const existingMedicalHistory = await prisma.medicalHistory.findUnique({
    where: {
      id: patientId,
    },
  });
  // If a medical history record with the provided patient ID does not exist, create a new one
  if (!existingMedicalHistory) {
    await prisma.medicalHistory.create({
      data: {
        id: patientId, // Assign the patient ID directly to the id field
        // Include other fields as needed
      },
    });
  }
}