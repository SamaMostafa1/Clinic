import express, { Router, Request, Response } from 'express';
import { createRecord, getRecord, getRecordByRecordID, getRecordByPatientID } from '../controllers/recordController';

const router: Router = express.Router();

//===================================================================================================
router.post("/record", createRecord); // POST New Record
router.get('/record', getRecord); // GET All Records
router.get("/record/:recordId", getRecordByRecordID); // GET Record by RecordID
router.get("/record/:patient/:patientId", getRecordByPatientID); // GET Record by PatientID
//===================================================================================================

export default router; // Export the 'router' object
