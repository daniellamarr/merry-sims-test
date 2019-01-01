import express from 'express';
import { 
    UserController
 } from '../controller'

import { 
    EmailVerification
} from '../helper';
const { signUp } = UserController;
const { verifyLink, verifyToken } = EmailVerification;
const router = express.Router();

router
  .post('/auth/signUp', signUp);
router
  .get('/auth/users/verify/:token', verifyToken, verifyLink);
export default router;