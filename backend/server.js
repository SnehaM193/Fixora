require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const connectDB = require("./config/db");

const bookingRoutes = require("./routes/bookingRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

connectDB();

const app = express();

// ✅ Allow both local and production frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend-url.vercel.app" // replace after deployment
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(clerkMiddleware());

app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes);

// ✅ Use dynamic PORT for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
