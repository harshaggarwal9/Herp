import express from "express"
import {authMiddleware} from "../middleware/authMiddleware.js"
import {roleMiddleware} from "../middleware/roleMiddleware.js"
import { login, signup } from "../controllers/auth.contoller.js";
const router=express.Router();
router.post("/signup",authMiddleware,roleMiddleware(["teacher","admin"]),signup)
router.post("/login",login)
export default router;