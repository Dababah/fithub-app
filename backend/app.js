// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./src/routes/authRoutes");
const memberRoutes = require("./src/routes/memberRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");

const app = express();
// server.js
// ...
app.use(express.json()); // Mengurai JSON dari request body
app.use(express.urlencoded({ extended: true })); // Mengurai URL-encoded bodies
// ...
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static folder for QR codes and profile pictures
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/attendance", attendanceRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Welcome to Fithub API!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Jalankan server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://0.0.0.0:${PORT}`);
});