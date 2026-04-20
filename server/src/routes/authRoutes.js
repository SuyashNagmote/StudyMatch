import { Router } from "express";
import { getCurrentUser, login, saveProfile, signup } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../utils/validation.js";
import { signupSchema, loginSchema, profileSchema } from "../utils/validation.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/profile", protect, validate(profileSchema), saveProfile);
router.get("/me", protect, getCurrentUser);

export default router;
