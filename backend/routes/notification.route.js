import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { getNotification, postNotification } from "../controllers/notification.controller.js";

const router = express.Router();
router.post("/create",authMiddleware,roleMiddleware['admin'],postNotification);
router.get("/get",authMiddleware,getNotification);
export default router;