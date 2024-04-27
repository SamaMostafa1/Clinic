
import express from 'express';
import * as emrController from '../controllers/emrController';
const router = express.Router();
const verifyToken = require('../../../regestiration/src/middleWare/verifyToken');
const verifyDoctor = require('../../../regestiration/src/middleWare/verifyDoctor');
const verifyPatient = require('../../../regestiration/src/middleWare/verifyPatient');
router.get('/:patientId',verifyToken, emrController.getRecordByPatientId); //  doctors and admin
router.post('/',[verifyToken,verifyDoctor], emrController.createRecord);

export default router;