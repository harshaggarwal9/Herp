import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { roleMiddleware } from "../middleware/roleMiddleware.js"
import { createParent, getParent } from "../controllers/parent.controller.js"
const router = express.Router()
router.post("/create/:id",authMiddleware,roleMiddleware(["admin","teacher"]),createParent)
router.get("/fetch/:id",authMiddleware,roleMiddleware(["admin","teacher","parent"]),getParent)
export default router;