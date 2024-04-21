import express from 'express';
import * as loginController from '../controllers/loginController';
const verifyJWT = require('../middleWare/verifyJWT');
const router = express.Router();

router.post('/', loginController.loginUser );
router.get('/verify/', verifyJWT, loginController.logedIn)

export default router;