import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);

export default router;
