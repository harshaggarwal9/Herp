import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { createSlot, getSlotsByClass, getSlotsByTeacher } from "../controllers/timetable.controller.js";
const router = express.Router();
router.post("/create/:id",authMiddleware,roleMiddleware(["admin"]),createSlot);
router.post("/getbyTeacher",authMiddleware,roleMiddleware(["teacher"]),getSlotsByTeacher);
router.post("/getbyClass",authMiddleware,roleMiddleware(["student"]),getSlotsByClass);
export default router;