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
dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use("/api/student",studentRoutes)
app.use("/api/class",classRoutes)
app.use("/api/parent",parentRoutes)
app.use("/api/teacher",teacherRoutes)
app.use("/api/subject",subjectRoutes)
app.listen(process.env.PORT,()=>{
  connectDB()
  console.log(`Server is running on port ${process.env.PORT}`)
})