const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const Vendor = require("../models/Vendor");

// =======================================
// CREATE VENDOR PROFILE
// =======================================
router.post("/", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();

    const existing = await Vendor.findOne({ userId });

    if (existing) {
      return res.status(400).json({
        message: "Vendor profile already exists",
      });
    }

    const vendor = await Vendor.create({
      userId,
      businessName: req.body.businessName,
      serviceType: req.body.serviceType,
      phone: req.body.phone,
      address: req.body.address,
      pricePerVisit: Number(req.body.pricePerVisit),
      description: req.body.description,
    });

    res.status(201).json(vendor);
  } catch (err) {
    console.error("Vendor create error:", err);
    res.status(500).json({ message: "Failed to create profile" });
  }
});

// =======================================
// UPDATE VENDOR PROFILE
// =======================================
router.put("/me", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();

    const updated = await Vendor.findOneAndUpdate(
      { userId },
      {
        businessName: req.body.businessName,
        serviceType: req.body.serviceType,
        phone: req.body.phone,
        address: req.body.address,
        pricePerVisit: Number(req.body.pricePerVisit),
        description: req.body.description,
      },
      {
        returnDocument: "after", // 🔥 remove deprecated warning
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Vendor profile not found",
      });
    }

    res.json(updated);
  } catch (err) {
    console.error("Vendor update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// =======================================
// GET MY PROFILE (ROLE CHECK)
// =======================================
router.get("/me", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor profile not found",
      });
    }

    res.json(vendor);
  } catch (err) {
    console.error("Vendor fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// =======================================
// GET ALL VENDORS (PUBLIC)
// =======================================
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find().select(
      "businessName serviceType pricePerVisit address description"
    );

    res.json(vendors);
  } catch (err) {
    console.error("Fetch vendors error:", err);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
});

module.exports = router;

// =======================================
// GET USER ROLE
// =======================================
router.get("/role", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();

    const vendor = await Vendor.findOne({ userId });

    if (vendor) {
      return res.json({ role: "vendor" });
    }

    return res.json({ role: "customer" });
  } catch (err) {
    console.error("Role check error:", err);
    res.status(500).json({ message: "Failed to detect role" });
  }
});
