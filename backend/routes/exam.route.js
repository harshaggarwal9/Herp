import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { createExam, findExambyclass, findExambySubject } from "../controllers/exam.controller.js";
const router = express.Router();
router.post("/create",authMiddleware,roleMiddleware(["admin","teacher"]),createExam);
router.get("/fetch/class/:id",authMiddleware,roleMiddleware(["admin","teacher"]),findExambyclass);
router.get("/fetch/subject/:id",authMiddleware,roleMiddleware(["admin","teacher"]),findExambySubject);
export default router