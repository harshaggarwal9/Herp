import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { createClass } from "../controllers/class.controller.js";
const router = express.Router();
router.post("/create",authMiddleware,roleMiddleware(["admin"]),createClass)
export default router 