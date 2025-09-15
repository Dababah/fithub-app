const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");
const { Admin, Member, Membership } = require("../models");
const { hashPassword, comparePassword } = require("../utils/passwordHash");
const { generateQrForMember } = require("../utils/qrGenerator");
const { v4: uuidv4 } = require("uuid");

/** REGISTER MEMBER */
async function registerMember(req, res) {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "FullName, email, atau password wajib diisi." });
    }

    const existingMember = await Member.findOne({ where: { email } });
    if (existingMember) return res.status(400).json({ message: "Email sudah digunakan." });

    const hashedPassword = await hashPassword(password);
    const qrToken = uuidv4();

    const member = await Member.create({ fullName, email, phone, password: hashedPassword, qrToken });
    const { path: qrPath } = await generateQrForMember(qrToken, member.id, process.env.BASE_URL);

    member.qrPath = qrPath;
    await member.save();
    await Membership.create({ memberId: member.id, status: "inactive" });

    return res.status(201).json({ message: "Anggota berhasil dibuat", data: { id: member.id, fullName: member.fullName, email: member.email, qrPath: member.qrPath } });
  } catch (err) {
    console.error("Kesalahan saat registrasi anggota:", err);
    return res.status(500).json({ message: "Kesalahan server" });
  }
}

/** REGISTER ADMIN */
async function registerAdmin(req, res) {
  try {
    const { username, password, name } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username atau password wajib diisi." });

    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) return res.status(400).json({ message: "Username sudah digunakan" });

    const hashedPassword = await hashPassword(password);
    const admin = await Admin.create({ username, password: hashedPassword, name });

    return res.status(201).json({ message: "Admin berhasil dibuat", data: { id: admin.id, username: admin.username, name: admin.name } });
  } catch (err) {
    console.error("Kesalahan saat registrasi admin:", err);
    return res.status(500).json({ message: "Kesalahan server" });
  }
}

/** LOGIN MEMBER */
async function loginMember(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email atau password tidak ada" });

    const member = await Member.findOne({ where: { email } });
    if (!member) return res.status(401).json({ message: "Member tidak ditemukan" });

    const passwordMatch = await comparePassword(password, member.password);
    if (!passwordMatch) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ id: member.id, role: "member", email: member.email }, secret, { expiresIn });
    // Perbaikan: tambahkan 'return' di sini
    return res.json({ token, role: "member" });
  } catch (err) {
    console.error("Kesalahan saat login member:", err);
    return res.status(500).json({ message: "Kesalahan server" });
  }
}

/** LOGIN ADMIN */
async function loginAdmin(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username atau password tidak ada" });

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.status(401).json({ message: "Admin tidak ditemukan" });

    const passwordMatch = await comparePassword(password, admin.password);
    if (!passwordMatch) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ id: admin.id, role: "admin", username: admin.username }, secret, { expiresIn });
    // Perbaikan: tambahkan 'return' di sini
    return res.json({ token, role: "admin" });
  } catch (err) {
    console.error("Kesalahan saat login admin:", err);
    return res.status(500).json({ message: "Kesalahan server" });
  }
}

module.exports = { registerAdmin, registerMember, loginAdmin, loginMember };