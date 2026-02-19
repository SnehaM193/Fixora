const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    businessName: { type: String, required: true },

    serviceType: {
      type: String,
      required: true,
      enum: ["plumbing", "electrical", "ac", "appliance", "carpentry"], // 🔥 restrict values
    },

    phone: String,
    address: String,
    pricePerVisit: Number,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
