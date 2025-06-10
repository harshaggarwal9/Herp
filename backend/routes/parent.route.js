import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { roleMiddleware } from "../middleware/roleMiddleware.js"
import { createParent, fetchChildrenResult, fetchChildrensSubjects, fetchParentPendingFees, getParent } from "../controllers/parent.controller.js"
const router = express.Router()
router.post("/create/:id",authMiddleware,roleMiddleware(["admin","teacher"]),createParent)
router.get("/fetch/:id",authMiddleware,roleMiddleware(["admin","teacher","parent"]),getParent)
router.get("/fetchFees",authMiddleware,roleMiddleware(["parent"]),fetchParentPendingFees);
router.post("/results",authMiddleware,roleMiddleware(["parent"]),fetchChildrenResult);
router.post("/subjects",authMiddleware,roleMiddleware(["parent"]),fetchChildrensSubjects);
export default router;