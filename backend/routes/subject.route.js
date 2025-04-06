import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { assignSubject, createSubject } from "../controllers/subject.controller.js";
const router=express.Router();
router.post("/create",authMiddleware,roleMiddleware(["admin"]),createSubject)
router.post("/assign/:id",authMiddleware,roleMiddleware(["admin"]),assignSubject)
export default router