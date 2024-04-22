import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

require("dotenv").config();

//==================================================================================================================
export async function createRecord(req: Request, res: Response) {
  // Create new record
  const {
    appointmentId,
    weight,
    length,
    servicesDescription,
    recommendedActionDescription,
    vital,
    vaccines,
    eyeMeasurements,
    nutritionData,
  } = req.body;

  try {
    const appointmentsUrl = process.env.APPOINTMENTS_API_URL;
    const clinicsUrl = process.env.CLINICS_API_URL;

    const response = await axios
      .get(`${appointmentsUrl}/appointments/${appointmentId}`)
      .catch(() => null); // Get appointment by id

    // if (!response || !response.data) {
    //   // Check if AppointmentID exist in Appointments List
    //   console.log(
    //     `AppointmentID ${appointmentId} is not found in Appointments List`
    //   );
    //   return res.status(404).json({
    //     message: `AppointmentID ${appointmentId} is not found in Appointments List`,
    //   });
    // }

    const clinicId = response?.data?.clinicId; // Get clinicID from appointment service
    const patientId = response?.data?.patientId; // Get patientID from appointment service
    const recordDate = response?.data?.date; // Get appointmentDate from appointment service

    const responseClinic = await axios
      .get(`${clinicsUrl}/api/v1/clinic/${clinicId}`)
      .catch(() => null); // Get clinic by id

    if (!responseClinic || !responseClinic.data) {
      // Check if ClinicID exist in Clinics List
      console.log(`ClinicID ${clinicId} is not found in Clinics List`);
      return res
        .status(404)
        .json({ message: `This appointment belongs to undefined clinic` });
    }

    const responseClinicName = responseClinic?.data?.data?.clinic?.name; // Get clinicName from clinic service

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

    const insertedRecord = await insertRecord(
      patientId,
      appointmentId,
      clinicId,
      recordDate,
      weight,
      length
    );

    if (vital != null && Object.keys(vital).length !== 0) {
      // Check if the patient's vital signs data has been obtained at the clinic. (Not NULL)
      await insertVital(insertedRecord.recordId, vital);
    }
    if (servicesDescription !== "") {
      // Check if patient had an additional service in the clinic (Not NULL)
      await insertServices(insertedRecord.recordId, servicesDescription);
    }
    if (recommendedActionDescription !== "") {
      // Check if patient had a recommended action in the clinic (Not NULL)
      await insertRecommendedAction(
        insertedRecord.recordId,
        recommendedActionDescription
      );
    }
    // Check ClinicName and insert accordingly
    if (responseClinicName === process.env.Pediatric_Clinic_ID) {
      // Kids Clinic
      if (vaccines.length > 0) {
        await insertVaccines(insertedRecord.recordId, vaccines);
      }
    } else if (responseClinicName === process.env.Ophthalmology_Clinic_ID) {
      // Eyes Clinic
      if (
        eyeMeasurements != null &&
        Object.keys(eyeMeasurements).length !== 0
      ) {
        await insertEyeMeasurement(insertedRecord.recordId, eyeMeasurements);
      }
    } else if (responseClinicName === process.env.Nutrition_Clinic_ID) {
      // Nutrition Clinic
      if (nutritionData != null && Object.keys(nutritionData).length !== 0) {
        await insertNutrition(insertedRecord.recordId, nutritionData);
      }
    }
    console.log(
      `New Record is created successfully with ${responseClinicName} Clinic`
    );
    res.status(201).json({
      message: `New Record is created successfully with ${responseClinicName} Clinic`,
    });

    // Rest of your existing code
  } catch (appointmentsError) {
    console.error(
      "Error checking for existing AppointmentID:",
      appointmentsError
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//==================================================================================================================
export async function getRecord(req: Request, res: Response): Promise<void> {
  // Get All Records
  try {
    const records = await generateRecordQuery("", "");
    if (records.length === 0) {
      res.status(404).json({ message: "No records found in records list" });
    } else {
      res.status(200).json(records);
    }
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//==================================================================================================================
export async function getRecordByRecordID(
  req: Request,
  res: Response
): Promise<void> {
  // Get All Record By RecordID
  const recordId = parseInt(req.params.recordId);
  try {
    const records = await generateRecordQuery(
      "",
      `AND record.RecordID = ${recordId}`
    );
    if (records.length === 0) {
      res
        .status(404)
        .json({ message: `Record with ID ${recordId} not found.` });
    } else {
      res.status(200).json(records);
    }
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//==================================================================================================================
export async function getRecordByPatientID(
  req: Request,
  res: Response
): Promise<void> {
  // Get All Record By patientID
  const patientId = parseInt(req.params.patientId);
  try {
    const records = await generateRecordQuery(
      "",
      `AND record.PatientID = ${patientId}`
    );
    if (records.length === 0) {
      res.status(404).json({
        message: `No records found for patient with ID ${patientId}.`,
      });
    } else {
      res.status(200).json(records);
    }
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//=====================================================================================================================
async function generateRecordQuery(
  joinConditions: string,
  whereConditions: string
): Promise<any> {
  // Function to generate the common Prisma query for retrieving records
  return prisma.record.findMany({
    where: {
      recordId: {
        not: null,
      },
      ...(whereConditions ? eval(`(${whereConditions})`) : {}),
    },
    include: {
      services: true,
      recommendedActions: true,
      vitals: true,
      vaccines: true,
      eyeMeasurements: true,
      nutritions: true,
    },
  });
}
//==========================================================================================================================
// function processQueryResult(result: any[]): any[] {
//   // Function to process the query result and build the record map
//   const recordMap = {};

//   result.forEach((row) => {
//     const {
//       recordId,
//       services,
//       recommendedAction,
//       vital,
//       vaccines,
//       eyeMeasurement,
//       nutrition,
//     } = row;

//     if (!recordMap[recordId]) {
//       recordMap[recordId] = {
//         recordId,
//         patientId: row.patientId,
//         appointmentId: row.appointmentId,
//         clinicId: row.clinicId,
//         recordDate: row.rDate,
//         weight: row.weight,
//         length: row.length,
//         services: [],
//         recommendedAction: [],
//         vital: [],
//         vaccines: [],
//         eyeMeasurement: [],
//         nutrition: [],
//       };
//     }
//     if (services && services.length > 0) {
//       // Check if ServicesID is not null
//       services.forEach((service) => {
//         recordMap[recordId].services.push({
//           servicesDescription: service.servicesDescription,
//         });
//       });
//     }

//     if (recommendedAction && recommendedAction.length > 0) {
//       // Check if RecommendedActionID is not null
//       recommendedAction.forEach((action) => {
//         recordMap[recordId].recommendedAction.push({
//           recommendedActionDescription: action.recommendedActionDescription,
//         });
//       });
//     }

//     if (vital && vital.length > 0) {
//       // Check if VitalID is not null
//       vital.forEach((v) => {
//         recordMap[recordId].vital.push({
//           bloodPressure: v.bloodPressure,
//           respirationRate: v.respirationRate,
//           heartRate: v.heartRate,
//           diabeticTest: v.diabeticTest,
//           sPO2: v.sPO2,
//         });
//       });
//     }

//     if (vaccines && vaccines.length > 0) {
//       // Check if VaccinesID is not null
//       vaccines.forEach((vaccine) => {
//         recordMap[recordId].vaccines.push({
//           vaccineName: vaccine.vName,
//           vaccineType: vaccine.vType,
//           vaccineDate: vaccine.vDate,
//         });
//       });
//     }

//     if (eyeMeasurement && eyeMeasurement.length > 0) {
//       // Check if EyeMeasurementID is not null
//       eyeMeasurement.forEach((eye) => {
//         recordMap[recordId].eyeMeasurement.push({
//           leftEye: eye.leftEye,
//           rightEye: eye.rightEye,
//         });
//       });
//     }

//     if (nutrition && nutrition.length > 0) {
//       // Check if NutritionID is not null
//       nutrition.forEach((n) => {
//         recordMap[recordId].nutrition.push({
//           dietPlan: n.dietPlan,
//           inbody: n.inbody,
//         });
//       });
//     }
//   });

//   return Object.values(recordMap);
// }
//=====================================================================================================================
async function insertRecord(
  patientId: number,
  appointmentId: string,
  clinicId: number,
  date: string,
  weight: number,
  length: number
): Promise<any> {
  // Insert into record table
  return prisma.record.create({
    data: {
      patientId,
      appointmentId,
      clinicId,
      date,
      weight,
      length,
    },
  });
}
//==============================================================================================================
async function insertServices(
  recordId: number,
  serviceDescription: string
): Promise<any> {
  // Insert into Services table
  return prisma.service.create({
    data: {
      recordId,
      serviceDescription,
    },
  });
}
//==============================================================================================================
async function insertRecommendedAction(
  recordId: number,
  recommendedActionDescription: string
): Promise<any> {
  // Insert into RecommendedAction table
  return prisma.recommendedAction.create({
    data: {
      recordId,
      recommendedActionDescription,
    },
  });
}
//==============================================================================================================
async function insertVital(recordId: number, vital: any): Promise<any> {
  // Insert into Vital Sign table
  return prisma.vital.create({
    data: {
      recordId,
      bloodPressure: vital.bloodPressure,
      respirationRate: vital.respirationRate,
      heartRate: vital.heartRate,
      diabeticTest: vital.diabeticTest,
      spo2: vital.spo2,
    },
  });
}
//==============================================================================================================
async function insertVaccines(recordId: number, vaccines: any[]): Promise<any> {
  // Insert into Vaccines table
  const vaccinePromises = vaccines.map(async (vaccine) => {
    return prisma.vaccine.create({
      data: {
        recordId,
        vName: vaccine.vaccineName,
        vType: vaccine.vaccineType,
        vDate: vaccine.vaccineDate,
      },
    });
  });

  return Promise.all(vaccinePromises);
}
//==============================================================================================================
async function insertEyeMeasurement(
  recordId: number,
  eyeMeasurements: any
): Promise<any> {
  // Insert into EyeMeasurement table
  return prisma.eyeMeasurement.create({
    data: {
      recordId,
      leftEye: eyeMeasurements.leftEye,
      rightEye: eyeMeasurements.rightEye,
    },
  });
}
//==============================================================================================================
async function insertNutrition(
  recordId: number,
  nutritionData: any
): Promise<any> {
  // Insert into Nutrition table
  return prisma.nutrition.create({
    data: {
      recordId,
      dietPlan: nutritionData.dietPlan,
      inBody: nutritionData.inbody,
    },
  });
}
//====================================================================================================================
module.exports = {
  createRecord,
  getRecord,
  getRecordByRecordID,
  getRecordByPatientID,
};
