import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// =====================================================
// 🔥 ROLE DETECTION (IMPORTANT)
// =====================================================

export const getUserRole = async (token) => {
  try {
    await api.get("/vendors/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // If vendor profile exists
    return "vendor";
  } catch (err) {
    if (err.response?.status === 404) {
      // No vendor profile = customer
      return "customer";
    }

    throw err;
  }
};

// =====================================================
// CUSTOMER APIs
// =====================================================

// CREATE BOOKING
export const createBooking = async (data, token) => {
  const res = await api.post("/bookings", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// GET USER BOOKINGS
export const getBookings = async (token) => {
  const res = await api.get("/bookings/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(res.data) ? res.data : [];
};

// CANCEL BOOKING
export const cancelBooking = async (id, token) => {
  const res = await api.patch(
    `/bookings/${id}`,
    { status: "Cancelled" },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// =====================================================
// PUBLIC VENDOR APIs
// =====================================================

export const getAllVendors = async () => {
  const res = await api.get("/vendors");
  return Array.isArray(res.data) ? res.data : [];
};

// =====================================================
// VENDOR BOOKING APIs
// =====================================================

export const getVendorBookings = async (token) => {
  const res = await api.get("/bookings/vendor", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(res.data) ? res.data : [];
};

export const updateBookingStatus = async (id, status, token) => {
  const res = await api.patch(
    `/bookings/${id}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getEarnings = async (token) => {
  const res = await api.get("/bookings/vendor/earnings", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAnalytics = async (token) => {
  const res = await api.get("/bookings/vendor/analytics", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// =====================================================
// VENDOR PROFILE APIs
// =====================================================

export const createVendorProfile = async (data, token) => {
  const res = await api.post("/vendors", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateVendorProfile = async (data, token) => {
  const res = await api.put("/vendors/me", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getVendorProfile = async (token) => {
  const res = await api.get("/vendors/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
