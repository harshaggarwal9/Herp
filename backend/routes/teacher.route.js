import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { createTeacher, fetchTeacher, assignTeacher, fetchAllTeachers } from "../controllers/teacher.controller.js";
const router=express.Router();
router.post("/create/:id",authMiddleware,roleMiddleware(["admin"]),createTeacher)
router.get("/fetch",authMiddleware,roleMiddleware(["admin"]),fetchAllTeachers)
router.get("/fetch/:userId",authMiddleware,roleMiddleware(["admin","teacher"]),fetchTeacher);
router.post("/assign/:id",authMiddleware,roleMiddleware(["admin"]),assignTeacher)
export default router