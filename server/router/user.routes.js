import { Router } from 'express';
import { checkAuth, login, logout, register } from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/check-auth").get(authenticateToken, checkAuth);

export default router;