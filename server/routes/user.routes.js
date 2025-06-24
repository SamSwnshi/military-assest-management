import { Router } from 'express';
import { getAllUsers } from '../controller/user.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, getAllUsers);

export default router; 