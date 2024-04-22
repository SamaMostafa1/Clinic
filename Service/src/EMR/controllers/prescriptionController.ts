import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma: {
  [key: string]: any,
} = new PrismaClient();
require("dotenv").config();

//=========================================================================================
async function createPrescription(req: Request, res: Response) {
  // Create new prescription
  const { appointmentId, doctorName, diagnosis, extraNotes, drugs } = req.body;

  try {
    // Check if AppointmentID exists
    const appointmentsUrl = process.env.APPOINTMENTS_API_URL;
    const response = await axios
      .get(`${appointmentsUrl}/appointments/${appointmentId}`)
      .catch(() => null);

    if (!response || !response.data) {
      console.log(
        `AppointmentID ${appointmentId} is not found in Appointments List`
      );
      return res
        .status(404)
        .json({
          message: `AppointmentID ${appointmentId} is not found in Appointments List`,
        });
    }
    const patientId = response?.data?.patientId;

    // Check if PatientID exists in MedicalHistory table
    const medicalHistoryResult = await prisma.medicalHistory.findFirst({
      where: {
        patientId,
      },
    });

    if (!medicalHistoryResult) {
      // If PatientID does not exist in the MedicalHistory table, insert it
      /* "Assuming that the Appointment Service has checked that the PatientID already exists in the Registration Service, 
        since an appointment has already been scheduled, it is certain that the patient exists, So insert it into my database." */
      await prisma.medicalHistory.create({
        data: {
          patientId,
        },
      });
      console.log("New Patient is created with PatientID:", patientId);
    }

    const insertedPrescription = await insertPrescription(
      patientId,
      appointmentId,
      doctorName,
      diagnosis,
      extraNotes
    );

    if (drugs.length > 0) {
      await insertDrugs(insertedPrescription.prescriptionId, patientId, drugs);
    }

    console.log("Prescription with Drugs is created successfully");
    res
      .status(201)
      .json({ message: "Prescription with Drugs is created successfully" });
  } catch (appointmentsError) {
    console.error(
      "Error checking for existing AppointmentID:",
      appointmentsError
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//================================================================================================
async function getAllPrescriptions(req: Request, res: Response): Promise<void> {
  //Get all prescriptions
  try {
    const prescriptionArray = await generatePrescriptionQuery("", "");
    if (prescriptionArray.length === 0) {
      res
        .status(404)
        .json({ message: "No Prescriptions found in prescriptions list" });
    } else {
      res.json(prescriptionArray);
    }
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//================================================================================================
async function getPrescriptionByID(req: Request, res: Response): Promise<void> {
  // Get prescription by prescriptionId
  const prescriptionId = parseInt(req.params.prescriptionId);
  try {
    const prescriptionArray = await generatePrescriptionQuery(
      "",
      ` AND prescription.PrescriptionID = ${prescriptionId}`
    );
    if (prescriptionArray.length === 0) {
      res
        .status(404)
        .json({ message: `Prescription with ID ${prescriptionId} not found.` });
    } else {
      res.json(prescriptionArray);
    }
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//================================================================================================
async function getPrescriptionByPatientID(
  req: Request,
  res: Response
): Promise<void> {
  // Get prescription by patientId
  const patientId = parseInt(req.params.patientId);
  try {
    const prescriptionArray = await generatePrescriptionQuery(
      "",
      ` AND prescription.PatientID = ${patientId}`
    );
    if (prescriptionArray.length === 0) {
      res
        .status(404)
        .json({
          message: `Prescription with PatientID ${patientId} not found.`,
        });
    } else {
      res.json(prescriptionArray);
    }
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//===============================================================================================
async function generatePrescriptionQuery(
  joinConditions: string,
  whereConditions: string
): Promise<any> {
  // Function to generate the common Prisma query for retrieving prescriptions
  return prisma.prescription.findMany({
    where: {
      prescriptionId: {
        not: null,
      },
      ...(whereConditions ? eval(`(${whereConditions})`) : {}),
    },
    include: {
      drugs: true,
    },
  });
}

//===============================================================================================
async function insertPrescription(
  patientId: number,
  appointmentId: number,
  doctorName: string,
  diagnosis: string,
  extraNotes: string
): Promise<any> {
  // Insert into Prescription table
  const newPrescription = await prisma.prescription.create({
    data: {
      patientId,
      appointmentId,
      doctorName,
      diagnosis,
      extraNotes,
    },
  });

  console.log(
    "New Prescription created with PrescriptionID:",
    newPrescription.prescriptionId
  );
  return newPrescription;
}
//==============================================================================================
async function insertDrugs(
  prescriptionId: number,
  patientId: number,
  drugs: any[]
): Promise<void> {
  // Insert drugs into drug table
  const drugPromises = drugs.map(async (drug) => {
    const newDrug = await prisma.drug.create({
      data: {
        prescriptionId,
        patientId,
        dName: drug.drugName,
        dDuration: drug.drugDuration,
        dDose: drug.drugDose,
      },
    });

    console.log(`New Drug is created with DrugID:`, newDrug.drugId);
  });

  await Promise.all(drugPromises);
}
//===============================================================================================
export {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionByID,
  getPrescriptionByPatientID,
};
