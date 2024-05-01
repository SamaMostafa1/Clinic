import express from 'express';
import * as emrController from '../controllers/emrController';
const router = express.Router();
const verifyToken = require('../../../regestiration/src/middleWare/verifyToken');
const verifyDoctor = require('../../../regestiration/src/middleWare/verifyDoctor');
const verifyPatient = require('../../../regestiration/src/middleWare/verifyPatient');


//router.get('/:patientId',verifyToken, emrController.getRecordByPatientId);
router.post('/patient/:id/drugs',emrController.createDrugs);
router.get('/patient/:id/drugs',emrController.getDrugsByPatientId);
router.delete('/patient/:id/drugs/:id',emrController.deleteDrug);


router.post('/patient/:id/record',emrController.createRecord);
router.get('/patient/:id/record',emrController.getRecordByPatientId);
router.delete('/patient/:id/record/:id',emrController.deleteRecordById);


router.post('/patient/:id/test',emrController.createMedicalTest);
router.get('/patient/:id/test',emrController.getMedicalTestByPatientId);
router.delete('/patient/:id/test/:id',emrController.deleteMedicalTestById);


router.post('/patient/:id/operation',emrController.createOperation);
router.get('/patient/:id/operation',emrController.getOperationByPatientId);
router.delete('/patient/:id/operation/:id',emrController.deleteOperationById);


router.post('/patient/:id/illness',emrController.createIllness);
router.get('/patient/:id/illness',emrController.getIllnessByPatientId);
router.delete('/patient/:id/illness/:id',emrController.deleteIllnessById);

router.get('/patient/:id/medicalHistory',emrController.getMedicalHistoryByPatientId);

//router.post('/',[verifyToken,verifyDoctor], emrController.createRecord);

export default router;