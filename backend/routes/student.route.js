import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createStudent, getStudent } from "../controllers/student.contoller.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
const router=express.Router();
router.get("/profile/:id",authMiddleware,getStudent )
router.post("/create/:id",authMiddleware,roleMiddleware(["admin","teacher"]),createStudent)
export default router