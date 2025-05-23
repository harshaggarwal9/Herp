import express from "express"
import dotenv from "dotenv"
import  {connectDB } from "./config/db.js"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import studentRoutes from "./routes/student.route.js"
import classRoutes from "./routes/class.route.js"
import parentRoutes from "./routes/parent.route.js"
import teacherRoutes from "./routes/teacher.route.js"
import subjectRoutes from "./routes/subject.route.js"
import examRoutes from "./routes/exam.route.js"
import resultRoutes from "./routes/result.route.js"
import adminRoutes from "./routes/admin.route.js"
import cors from "cors"
import bodyParser from 'body-parser';
import webhookRoutes from './routes/webhook.routes.js';
import feeRoutes from './routes/fee.route.js';
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173", // ✅ No trailing slash
  credentials: true               // ✅ If you're using cookies or tokens
}));
app.use(
  '/webhooks/razorpay',
  bodyParser.raw({ type: 'application/json' })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use("/api/student",studentRoutes)
app.use("/api/class",classRoutes)
app.use("/api/parent",parentRoutes)
app.use("/api/teacher",teacherRoutes)
app.use("/api/subject",subjectRoutes)
app.use("/api/exam",examRoutes)
app.use("/api/result",resultRoutes)
app.use("/api/admin",adminRoutes)
app.use('/api/fees', feeRoutes);
app.use('/webhooks/razorpay', webhookRoutes);
app.listen(process.env.PORT,()=>{
  connectDB()
  console.log(`Server is running on port ${process.env.PORT}`)
})