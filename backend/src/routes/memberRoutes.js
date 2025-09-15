// src/routes/memberRoutes.js

const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");
const {
  createMember,
  listMembers,
  getMember,
  updateMember,
  deleteMember,
  getProfile,
  getAttendance,
  getDashboardData,
} = require("../controllers/memberController");

const validateRequest = require("../middlewares/validationMiddleware");

// Middleware ini akan diterapkan ke semua rute di bawahnya
router.use(authMiddleware);

// ===========================================
// ✅ TES: TEMPATKAN RUTE DASHBOARD DI SINI
// ===========================================
router.get("/dashboard", getDashboardData);

// ===========================================
// RUTE YANG BISA DIAKSES OLEH MEMBER & ADMIN
// ===========================================

// Mendapatkan profil member yang sedang login
router.get("/profile", getProfile);

// Mendapatkan riwayat kehadiran member yang sedang login
router.get("/attendance", getAttendance);

// Mendapatkan detail member berdasarkan ID (baik oleh member itu sendiri atau admin)
router.get("/:id", getMember);

// Memperbarui detail member berdasarkan ID
router.put(
  "/:id",
  [
    body("fullName").notEmpty().withMessage("Nama lengkap wajib diisi"),
    body("email").isEmail().withMessage("Format email tidak valid"),
    body("phone").isLength({ min: 10 }).withMessage("Nomor telepon minimal 10 digit"),
    body("status").isIn(["Aktif", "Nonaktif"]).withMessage("Status harus 'Aktif' atau 'Nonaktif'"),
  ],
  validateRequest,
  updateMember
);

// ===========================================
// RUTE KHUSUS UNTUK ADMIN SAJA
// ===========================================

// Middleware `adminOnly` akan diterapkan ke semua rute di bawahnya
router.use(adminOnly);

// Mendapatkan semua data anggota
router.get("/", listMembers);

// ✅ Pastikan baris rute dashboard yang lama sudah dihapus dari sini.

// Membuat anggota baru
router.post(
  "/",
  [
    body("fullName").notEmpty().withMessage("Nama lengkap wajib diisi"),
    body("email").isEmail().withMessage("Format email tidak valid"),
    body("phone").isLength({ min: 10 }).withMessage("Nomor telepon minimal 10 digit"),
    body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
    body("status").isIn(["Aktif", "Nonaktif"]).withMessage("Status harus 'Aktif' atau 'Nonaktif'"),
  ],
  validateRequest,
  createMember
);

// Menghapus anggota
router.delete("/:id", deleteMember);

module.exports = router;