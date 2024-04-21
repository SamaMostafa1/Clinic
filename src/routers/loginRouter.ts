import express from 'express';
import * as loginController from '../controllers/loginController';
import * as verifyJWT from '../middleWare/verifyJWT';

const router = express.Router();

router.post('/', loginController.loginUser );
router.get('/',verifyJWT.verifyToken,loginController.logedIn)
export default router;