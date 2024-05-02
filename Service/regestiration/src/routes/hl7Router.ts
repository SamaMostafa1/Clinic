import express from 'express';
import * as hl7Controller from '../controllers/hl7Controller';
// import * as verifyJWT from '../middleWare/verifyJWT';

const router = express.Router();

router.post('/', hl7Controller.createDiagnosis );
router.get('/:userId',hl7Controller.getPatientInfo)
// router.get('/',verifyJWT.verifyToken,loginController.logedIn)
export default router;