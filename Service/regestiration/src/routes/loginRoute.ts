import express from 'express';
import * as loginController from '../controllers/loginController';
const verifyToken = require('../middleWare/verifyToken');
const router = express.Router();

router.post('/', loginController.loginUser );
router.get('/verify/', verifyToken, loginController.logedIn)

export default router;