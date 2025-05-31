import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { createSlot } from "../controllers/timetable.controller.js";
const router = express.Router();
router.post("/create/:id",authMiddleware,roleMiddleware(["admin"]),createSlot);
export default router;