import express from "express";
import { getPendingUsers, approveUser } from "../controllers/admin.controller.js";
const router = express.Router();
router.get("/pending-users", getPendingUsers);
router.post("/approve-user", approveUser);
export default router;
