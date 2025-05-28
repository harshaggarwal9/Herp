import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { getNotification, postNotification } from "../controllers/notification.controller.js";

const router = express.Router();
router.post("/create",authMiddleware,roleMiddleware(['admin']),postNotification);
router.get("/get",authMiddleware,getNotification);
export default router;