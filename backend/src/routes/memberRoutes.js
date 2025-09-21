// routes/memberRoutes.js
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
  generateMembersPdf,
} = require("../controllers/memberController");

const validateRequest = require("../middlewares/validationMiddleware");

// Middleware ini akan diterapkan ke semua rute di bawahnya
router.use(authMiddleware);

// ===========================================
// ✅ Dashboard Data (untuk admin & member)
// ===========================================
router.get("/dashboard", getDashboardData);

// ===========================================
// ✅ RUTE KHUSUS UNTUK ADMIN SAJA
// ===========================================
router.use(adminOnly);

// Mendapatkan semua data anggota
router.get("/", listMembers);

// ✅ RUTE BARU: Laporan PDF (HARUS di atas `/:id`)
router.get("/pdf-report", generateMembersPdf);

// Membuat anggota baru
router.post(
  "/",
  [
    body("fullName").notEmpty().withMessage("Nama lengkap wajib diisi"),
    body("email").isEmail().withMessage("Format email tidak valid"),
    body("phone").isLength({ min: 10 }).withMessage("Nomor telepon minimal 10 digit"),
    body("password").isLength({ min: 6}).withMessage("Password minimal 6 karakter"),
    body("status").isIn(["Aktif", "Nonaktif"]).withMessage("Status harus 'Aktif' atau 'Nonaktif'"),
  ],
  validateRequest,
  createMember
);

// Menghapus anggota
router.delete("/:id", deleteMember);

// ===========================================
// ✅ RUTE MEMBER & ADMIN (harus paling bawah)
// ===========================================
router.get("/profile", getProfile);
router.get("/attendance", getAttendance);

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

// Detail member berdasarkan ID
router.get("/:id", getMember);

module.exports = router;
