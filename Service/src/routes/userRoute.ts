import express from 'express';
import * as userController from '../controllers/userController';
const verifyToken = require('../middleWare/verifyToken');
const verifyDoctor = require('../middleWare/verifyDoctor');
const verifyPatient = require('../middleWare/verifyPatient');
const router = express.Router();

router.get('/',[verifyToken,verifyPatient], userController.getAllUsers); 
router.get('/userId/:userId',userController.getUserById)
router.get('/userName/:userName',userController.getUserByUserName)
export default router;