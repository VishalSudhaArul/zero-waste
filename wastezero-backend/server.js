require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const compression = require("compression");
const helmet = require("helmet");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const pickupRoutes = require("./routes/pickupRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://zero-waste-s1td.vercel.app",
  "http://localhost:4200",
  "http://localhost:3000"
].filter(Boolean);

const checkCorsOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);
  if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app") || origin.startsWith("http://localhost")) {
    return callback(null, true);
  }
  callback(new Error("Not allowed by CORS"));
};

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: checkCorsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// Make io accessible in controllers via req.app.get("io")
app.set("io", io);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // User joins their own room (using their userId)
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Handle sending message via socket
  socket.on("sendMessage", (data) => {
    io.to(data.receiver_id).emit("newMessage", data);
  });

  // Handle notification
  socket.on("sendNotification", (data) => {
    io.to(data.user_id).emit("newNotification", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Connect MongoDB
connectDB();

// Middlewares
app.use(helmet());
app.use(compression());

app.use(cors({
  origin: checkCorsOrigin,
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("WasteZero API Running...");
});

// Start Server (use server not app for socket.io)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});