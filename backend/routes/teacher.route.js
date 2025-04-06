import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { createTeacher, fetchTeacher } from "../controllers/teacher.controller.js";
const router=express.Router();
router.post("/create/:id",authMiddleware,roleMiddleware(["admin"]),createTeacher)
router.get("/fetch/:id",authMiddleware,roleMiddleware(["admin","teacher"]),fetchTeacher);
export default router