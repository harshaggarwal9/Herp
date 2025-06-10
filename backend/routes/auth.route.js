import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { login, signup ,logout,getProfile} from "../controllers/auth.contoller.js";
const router=express.Router();
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/profile",authMiddleware,getProfile)
export default router;