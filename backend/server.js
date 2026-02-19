require("dotenv").config();


const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const connectDB = require("./config/db");

const bookingRoutes = require("./routes/bookingRoutes");
const vendorRoutes = require("./routes/vendorRoutes");


connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(clerkMiddleware());

app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes);

app.listen(5000, () =>
  console.log("🚀 Server running on port 5000")
);

