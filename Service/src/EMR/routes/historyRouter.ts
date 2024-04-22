import express, { Router, Request, Response } from 'express';
import historyController from '../controllers/historyController';

const { createMedicalHistory, getMedicalHistory, getMedicalHistoryByPatientID } = historyController;
//import { createMedicalHistory, getMedicalHistory, getMedicalHistoryByPatientID } from '../controllers/historyController';

const router: Router = express.Router();

router.get('/', getMedicalHistory);
router.get('/:patientId', getMedicalHistoryByPatientID);
router.post('/', createMedicalHistory);

export default router;
