require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const connectDB = require("./config/db");

const bookingRoutes = require("./routes/bookingRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

connectDB();

const app = express();

// ✅ Simple working CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

app.use(clerkMiddleware());

app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
