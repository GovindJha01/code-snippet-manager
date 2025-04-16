import express from 'express';
import auth from '../middleware/auth.js';
import { handleLogin, handleLogout, handleSignup } from '../controllers/user-controller.js';

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/logout',auth,handleLogout);

export default router;