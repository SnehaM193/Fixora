import {
  services,
  vendors,
  userBookings,
  vendorBookings,
  earningsData,
  analyticsData,
  userProfile,
  vendorProfile,
} from "./mock-data";

// Simulates async API calls - swap these with real Axios calls when backend is ready
// import axios from "axios";
// const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api" });

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Services ───────────────────────────────────────────────
export async function getServices() {
  await delay();
  return { data: services };
}

// ── Vendors ────────────────────────────────────────────────
export async function getVendors(serviceId) {
  await delay();
  const filtered = serviceId
    ? vendors.filter((v) => v.serviceId === serviceId)
    : vendors;
  return { data: filtered };
}

// ── User Bookings ──────────────────────────────────────────
export async function getBookings() {
  await delay();
  return { data: userBookings };
}

export async function createBooking(bookingData) {
  await delay(500);
  const newBooking = {
    id: `bk-${Date.now()}`,
    ...bookingData,
    status: "Pending",
  };
  userBookings.unshift(newBooking);
  return { data: newBooking };
}

export async function cancelBooking(bookingId) {
  await delay(400);
  const booking = userBookings.find((b) => b.id === bookingId);
  if (booking) booking.status = "Cancelled";
  return { data: booking };
}

// ── Vendor Bookings ────────────────────────────────────────
export async function getVendorBookings() {
  await delay();
  return { data: vendorBookings };
}

export async function updateBookingStatus(bookingId, status) {
  await delay(400);
  const booking = vendorBookings.find((b) => b.id === bookingId);
  if (booking) booking.status = status;
  return { data: booking };
}

// ── Earnings ───────────────────────────────────────────────
export async function getEarnings() {
  await delay();
  return { data: earningsData };
}

// ── Analytics ──────────────────────────────────────────────
export async function getAnalytics() {
  await delay();
  return { data: analyticsData };
}

// ── Profiles ───────────────────────────────────────────────
export async function getUserProfile() {
  await delay();
  return { data: userProfile };
}

export async function getVendorProfile() {
  await delay();
  return { data: vendorProfile };
}

export async function updateUserProfile(profileData) {
  await delay(500);
  Object.assign(userProfile, profileData);
  return { data: userProfile };
}

export async function updateVendorProfile(profileData) {
  await delay(500);
  Object.assign(vendorProfile, profileData);
  return { data: vendorProfile };
}
