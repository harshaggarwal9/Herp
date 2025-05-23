import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {  createChallan, deleteChallan, fetchAll, initiatePayment, verifyPayment } from "../controllers/fee.controller.js";
const router = express.Router();
router.post("/create",authMiddleware,roleMiddleware(["admin"]),createChallan);
router.post("/pay/:feeId",authMiddleware,roleMiddleware(["admin","parent","student"]),initiatePayment);
router.get("/verify-payment",authMiddleware,verifyPayment);
// router.get("/:studentId",authMiddleware,roleMiddleware(["admin","student","parent","teacher"]),checkfeestatus);
router.get("/all",fetchAll);
router.delete("/delete/:id",deleteChallan);
export default router