import express from 'express';
import * as userController from '../controllers/userController';
const verifyDoctor = require('../middleWare/verifyDoctor');
const verifyPatient = require('../middleWare/verifyPatient');
const router = express.Router();

router.get('/', userController.getAllUsers); 
router.get('/userId/:userId',userController.getUserById)
router.get('/userName/:userName',userController.getUserByUserName)
export default router;