import express from 'express';
import * as patientController from '../controllers/patientController';
const verifyToken = require('../middleWare/verifyToken');
const verifyDoctor = require('../middleWare/verifyDoctor');
const verifyPatient = require('../middleWare/verifyPatient');
const router = express.Router();

router.post('/', patientController.createPatient);
router.put('/:userId',[verifyToken,verifyPatient],patientController.updatePatient);
router.get('/:userId',[verifyToken,verifyPatient] ,patientController.getPatientById);
router.delete('/:userId', patientController.deletePatient);

export default router;