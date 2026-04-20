import { Router } from "express";
import { getGraph, getMatches } from "../controllers/matchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/graph", protect, getGraph);
router.get("/", protect, getMatches);

export default router;
