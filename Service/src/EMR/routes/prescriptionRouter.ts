import express, { Router } from "express";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionByPatientID,
  getPrescriptionByID,
} from "../controllers/prescriptionController";

const router = express.Router();

//===================================================================================================
router.post("/prescription", createPrescription);
router.get("/prescription", getAllPrescriptions);
router.get("/prescription/patient/:patientId", getPrescriptionByPatientID);
router.get("/prescription/:prescriptionId", getPrescriptionByID);
//===================================================================================================

export default router;
