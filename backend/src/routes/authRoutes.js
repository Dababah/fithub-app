const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  registerMember,
  loginAdmin,
  loginMember
} = require("../controllers/authController");

// Admin routes
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

// Member routes
router.post("/member/register", registerMember);
router.post("/member/login", loginMember);

module.exports = router;
