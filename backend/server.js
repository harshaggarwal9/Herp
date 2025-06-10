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
import path from "path"
import http from "http"
import {Server as SocketIOServer} from "socket.io"
import noticationRoutes from "./routes/notification.route.js"
import timeTableRoute from "./routes/timeTable.route.js"
dotenv.config();
const _dirname=path.resolve();
const app = express()
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "https://mjerp.onrender.com",
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.set('io', io);

app.use(express.json())
app.use(cors({
  origin: "https://mjerp.onrender.com", 
  credentials: true               
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
app.use('/api/notification',noticationRoutes);
app.use('/api/timetable',timeTableRoute);
app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
  });
});
server.listen(process.env.PORT,()=>{
  connectDB()
})