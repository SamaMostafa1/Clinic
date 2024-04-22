
import express from 'express';
import * as staffController from '../controllers/staffController';
const router = express.Router();
const verifyToken = require('../middleWare/verifyToken');
const verifyDoctor = require('../middleWare/verifyDoctor');
const verifyPatient = require('../middleWare/verifyPatient');

router.get('/', staffController.getAllstaff); //  doctors and admin
router.get('/:userId',[verifyToken,verifyDoctor],staffController.getStaffById);
router.get('/clinic/:clinicId', staffController.getDoctorsByClinicID);
router.post('/', staffController.createStaff);
router.put('/:userId',[verifyToken,verifyDoctor], staffController.updateStaff);
router.delete('/:userId',[verifyToken,verifyDoctor], staffController.deleteStaff);
export default router;