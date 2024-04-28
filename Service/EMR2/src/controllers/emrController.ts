import { Prisma } from '@prisma/client';
import { error } from 'console';
import { Request, Response } from 'express';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// Example route definition using Express.js

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

// Get Drugs by Patient ID
export const getDrugsByPatientId= async (req: Request, res: Response) => {
  const patientId = parseInt(req.params.id);

  try {
    // Fetch drugs associated with the patient
    const patientDrugs = await prisma.drug.findMany({
      where: {
        medicalHistoryId: patientId, // Assuming medicalHistoryId is used to link drugs to patients
      }, select: {
        name: true, // Select only the 'name' field of the drug
      },
    });    
    // Extract drug names from the array of drug objects
    res.json(patientDrugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Post Drugs to Patient
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

      res.status(201).json({ data: createdDrugs});       // successsful response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
//delete 
export const deleteDrug = async (req: Request, res: Response) => {
  const drugId = parseInt(req.params.id);

  try {
    // Check if the drug exists
    const existingDrug = await prisma.drug.findUnique({
      where: {
        id: drugId,
      },
    });

    if (!existingDrug) {
      return res.status(404).json({ error: 'Drug not found' });
    }

    // Delete the drug
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

