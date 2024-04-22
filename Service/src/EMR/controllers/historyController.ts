import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

//const prisma = new PrismaClient();
const prisma: {
  [key: string]: any;
} = new PrismaClient();
require('dotenv').config();

function generateRecordQuery(joinConditions: any, whereConditions: any) {
  // Function to generate the common Prisma query for retrieving medical history
  return prisma.medicalHistory.findMany({
    where: {
      patientId: {
        not: null,
      },
      ...whereConditions,
    },
    include: {
      complaints: true,
      illnesses: true,
      medicalTests: true,
      operations: true,
      drugs: true,
    },
  });
}

async function getMedicalHistory(req: Request, res: Response) {
  // Get All medical histories
  try {
    const medicalHistory = await generateRecordQuery('', '');
    if (medicalHistory.length === 0) {
      res.status(404).json({ message: 'No Patients found in the medical history list' });
    } else {
      res.status(200).json(medicalHistory);
    }
  } catch (error) {
    console.error('Error fetching medical history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getMedicalHistoryByPatientID(req: Request, res: Response) {
  // Get medical history with id
  const patientId = parseInt(req.params.patientId);
  try {
    const medicalHistory = await generateRecordQuery('', { patientId });
    if (medicalHistory.length === 0) {
      res.status(404).json({
        message: `No medical history found for patient with ID ${patientId}.`,
      });
    } else {
      res.status(200).json(medicalHistory);
    }
  } catch (error) {
    console.error('Error fetching medical history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function processQueryResult(result: any) {
  // Function to process the query result and build the medical history map
  const patientsMap: any = {};
  result.forEach((row: any) => {
    const {
      patientId,
      illnesses,
      operations,
      medicalTests,
      complaints,
      drugs,
    } = row;

    if (!patientsMap[patientId]) {
      patientsMap[patientId] = {
        patientId,
        illnesses: [],
        operations: [],
        medicalTests: [],
        complaints: [],
        drugs: [],
      };
    }

    illnesses.forEach((illness: any) => {
      patientsMap[patientId].illnesses.push({
        illnessDescription: illness.illnessDescription,
      });
    });

    operations.forEach((operation: any) => {
      patientsMap[patientId].operations.push({
        operationName: operation.operationName,
        operationDate: operation.operationDate,
      });
    });

    medicalTests.forEach((medicalTest: any) => {
      patientsMap[patientId].medicalTests.push({
        testDescription: medicalTest.testDescription,
      });
    });

    complaints.forEach((complaint: any) => {
      patientsMap[patientId].complaints.push({
        complaintDescription: complaint.complaintDescription,
      });
    });

    drugs.forEach((drug: any) => {
      patientsMap[patientId].drugs.push({
        drugName: drug.dName,
        drugDuration: drug.dDuration,
        drugDose: drug.dDose,
      });
    });
  });

  return Object.values(patientsMap);
}

async function createMedicalHistory(req: Request, res: Response) {
  const { patientId, illnesses, operations, medicalTests, complaints, drugs } = req.body;

  try {
    // Check if PatientID exists
    const registerationUrl = process.env.REGISTERATION_API_URL;
    const response = await axios.get(`${registerationUrl}/user/patient/${patientId}`).catch(() => null);

    if (!response || !response.data) {
      console.log(`PatientID ${patientId} is not found in Registration List`);
      return res.status(404).json({
        message: `PatientID ${patientId} is not found in Registration List`,
      });
    }

    // Map MedicalTests array to promises checking if TestID exists in the external API (Storage API)
    const medicalTestPromises = medicalTests.map(async (medicalTest: any) => {
      const { testId } = medicalTest;

      const testUrl = process.env.MEDICALTEST_API_URL;

      const Imagesresponse = await axios.get(`${testUrl}/api/v1/images/${testId}`).catch(() => null);
      const Filesresponse = await axios.get(`${testUrl}/api/v1/files/${testId}`).catch(() => null);

      if ((!Imagesresponse || !Imagesresponse.data) && (!Filesresponse || !Filesresponse.data)) {
        console.log(`Tests are not found for TestID ${testId}`);
        return { message: `Tests are not found for TestID ${testId}` };
      }

      // Check if the PatientID matches the response.patientId
      const imagePatientId = Imagesresponse?.data?.data?.image?.patientId;
      const filesPatientId = Filesresponse?.data?.data?.file?.patientId;
      const responsePatientId = imagePatientId || filesPatientId;

      if (responsePatientId != patientId) {
        console.log(
          `TestID ${testId} does not belong to the patient with patientId: ${patientId}`
        );
        return {
          message: `TestID ${testId} does not belong to the patient with patientId: ${patientId}`,
        };
      }

      return null;
    });

    const medicalTestResults = await Promise.all(medicalTestPromises); // Wait for all promises to resolve

    const testmessages = medicalTestResults.filter((result) => result && result.message); // Collect errors from medicalTestResults

    if (testmessages.length > 0) {
      return res.status(404).json({ messages: testmessages });
    }

    // Check if PatientID exists in MedicalHistory table
    const medicalHistoryResult = await prisma.medicalHistory.findFirst({
      where: {
        patientId,
      },
    });

    if (!medicalHistoryResult) {
      // If PatientID does not exist in the MedicalHistory table, insert it
      await prisma.medicalHistory.create({
        data: {
          patientId,
        },
      });
      console.log('New Patient is created with PatientID:', patientId);
    }

    // Check if PatientID has referenced values in other tables (his medical history already exists) (patient has only one medical history)
    const referencesResult:any = await prisma.$queryRaw`
      SELECT patientId FROM medicalTests WHERE patientId = ${patientId}
      UNION
      SELECT patientId FROM illnesses WHERE patientId = ${patientId}
      UNION
      SELECT patientId FROM operations WHERE patientId = ${patientId}
      UNION
      SELECT patientId FROM complaints WHERE patientId = ${patientId}
      UNION
      SELECT patientId FROM drug WHERE patientId = ${patientId} AND prescriptionId IS NULL
    `;

    if (referencesResult.length > 0) {
      // If PatientID has referenced values, return an error (patient has already history)
      const Message = `Sorry, PatientID ${patientId} has already added his medical history before`;
      console.log(Message);
      return res.status(404).json({ message: Message });
    }

    // Now that all validations passed, proceed with insertions into other tables

    // Insert data into the MedicalTests table
    await insertDataIntoTable(
      'medicalTests',
      ['patientId', 'testId', 'testDescription'],
      medicalTests,
      patientId
    );

    await Promise.all([
      // Insert data into other tables
      insertDataIntoTable(
        'illnesses',
        ['patientId', 'illnessDescription'],
        illnesses,
        patientId
      ),
      insertDataIntoTable(
        'operations',
        ['patientId', 'operationName', 'operationDate'],
        operations,
        patientId
      ),
      insertDataIntoTable(
        'complaints',
        ['patientId', 'complaintDescription'],
        complaints,
        patientId
      ),
      insertDataIntoTable(
        'drug',
        ['patientId', 'dName', 'dDuration', 'dDose'],
        drugs,
        patientId
      ),
    ]);

    // Respond with success message
    console.log(
      `New Medical History is created successfully with PatientID: ${patientId}`
    );
    res.status(201).json({
      message: `New Medical History is created successfully with PatientID: ${patientId}`,
    });
  } catch (error) {
    console.error('Error creating medical history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function insertDataIntoTable(
  tableName: string,
  columns: string[],
  data: any,
  patientId: number
){
  return Promise.all(
    data.map(async (item: any) => {
      try {
        await prisma[tableName].create({
          data: {
            patientId,
            ...item,
          },
        });
        console.log(`${tableName} created successfully`);
      } catch (error) {
        console.error(`Error creating ${tableName}:`, error);
        throw error;
      }
    })
  );
}

export = {
  createMedicalHistory,
  getMedicalHistory,
  getMedicalHistoryByPatientID,
};
