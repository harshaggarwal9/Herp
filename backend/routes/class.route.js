import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { createClass, deleteClass, fetchClasses, fetchClassesbyid } from "../controllers/class.controller.js";
const router = express.Router();
router.post("/create",authMiddleware,roleMiddleware(["admin"]),createClass)
router.get("/fetch",authMiddleware,roleMiddleware(["teacher","admin"]),fetchClasses)
router.get("/fetch/:id",authMiddleware,roleMiddleware(["admin","teacher"]),fetchClassesbyid)
router.delete("/delete/:id",authMiddleware,roleMiddleware(["admin","teacher"]),deleteClass)
export default router 