import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { createResult, fetchResults } from "../controllers/result.controller.js";
const router = express.Router();
router.post("/create/:id",authMiddleware,roleMiddleware(["admin","teacher"]),createResult);
router.get("/fetch",authMiddleware,roleMiddleware(["admin","teacher","student"]),fetchResults);
export default router