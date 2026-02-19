const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

const Booking = require("../models/Booking");
const Vendor = require("../models/Vendor");


// =======================================
// CREATE BOOKING (Customer)
// =======================================
router.post("/", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();

    const vendor = await Vendor.findById(req.body.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const booking = await Booking.create({
      userId,
      vendorId: vendor._id,
      vendorName: vendor.businessName,
      service: req.body.service,
      date: req.body.date,
      time: req.body.time,
      price: req.body.price,
      notes: req.body.notes,
      status: "Pending",
    });

    res.status(201).json(booking);

  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Failed to create booking" });
  }
});


// =======================================
// GET USER BOOKINGS
// =======================================
router.get("/user", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.error("User bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


// =======================================
// GET BOOKINGS FOR VENDOR
// =======================================
router.get("/vendor", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) return res.json([]);

    const bookings = await Booking.find({
      vendorId: vendor._id,
    }).sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.error("Vendor bookings error:", err);
    res.status(500).json({ message: "Failed to fetch vendor bookings" });
  }
});


// =======================================
// UPDATE BOOKING STATUS
// Only vendor of that booking can update
// =======================================
router.patch("/:id", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔒 CUSTOMER can cancel only their own booking
    if (status === "Cancelled") {
      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    // 🔒 VENDOR can mark as Accepted / Completed only if it is their booking
    if (status === "Accepted" || status === "Completed") {
      const vendor = await Vendor.findOne({ userId });

      if (!vendor || booking.vendorId.toString() !== vendor._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    booking.status = status;
    await booking.save();

    res.json(booking);

  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
});


// =======================================
// GET VENDOR EARNINGS
// Count ONLY completed bookings
// =======================================
router.get("/vendor/earnings", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      return res.json({
        totalBookings: 0,
        completedBookings: 0,
        totalEarnings: 0,
      });
    }

    const bookings = await Booking.find({
      vendorId: vendor._id,
    });

    const completed = bookings.filter(
      (b) => b.status === "Completed"
    );

    const totalEarnings = completed.reduce(
      (sum, b) => sum + (b.price || 0),
      0
    );

    res.json({
      totalBookings: bookings.length,
      completedBookings: completed.length,
      totalEarnings,
    });

  } catch (err) {
    console.error("Vendor earnings error:", err);
    res.status(500).json({ message: "Failed to load earnings" });
  }
});


// =======================================
// GET VENDOR ANALYTICS
// Real monthly breakdown
// =======================================
router.get("/vendor/analytics", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();

    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      return res.json({
        totalBookings: 0,
        completedBookings: 0,
        totalEarnings: 0,
        chartData: [],
      });
    }

    const bookings = await Booking.find({
      vendorId: vendor._id,
      status: "Completed",
    });

    const totalBookings = bookings.length;

    const totalEarnings = bookings.reduce(
      (sum, b) => sum + (b.price || 0),
      0
    );

    // Monthly grouping
    const monthlyMap = {};

    bookings.forEach((b) => {
      const date = new Date(b.date);
      const month = date.toLocaleString("default", { month: "short" });

      monthlyMap[month] = (monthlyMap[month] || 0) + b.price;
    });

    const chartData = Object.keys(monthlyMap).map((month) => ({
      month,
      earnings: monthlyMap[month],
    }));

    res.json({
      totalBookings,
      completedBookings: totalBookings,
      totalEarnings,
      chartData,
    });

  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
});

module.exports = router;
