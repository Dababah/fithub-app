const { Member, Membership, Attendance, sequelize } = require("../models");
const { hashPassword } = require("../utils/passwordHash");
const { generateQrForMember } = require("../utils/qrGenerator");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');
const moment = require('moment');

// Konfigurasi Multer untuk upload gambar
// Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'profiles');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

async function createMember(req, res) {
    try {
        const { fullName, email, phone, password, membership } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Nama, email, dan password wajib diisi." });
        }
        const existing = await Member.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: "Email sudah digunakan." });
        }
        const hashed = await hashPassword(password);
        const qrToken = uuidv4();
        const result = await sequelize.transaction(async (t) => {
            const member = await Member.create({
                fullName,
                email,
                phone,
                password: hashed,
                qrToken,
            }, { transaction: t });
            const { path: qrPath } = await generateQrForMember(
                qrToken,
                member.id,
                process.env.BASE_URL
            );
            member.qrPath = qrPath;
            await member.save({ transaction: t });
            if (membership && membership.packageName) {
                await Membership.create({
                    memberId: member.id,
                    status: membership.status,
                    packageName: membership.packageName,
                    startDate: membership.startDate,
                    endDate: membership.endDate
                }, { transaction: t });
            } else {
                await Membership.create({ memberId: member.id, status: 'Nonaktif' }, { transaction: t });
            }
            return member;
        });
        const createdMemberWithMembership = await Member.findByPk(result.id, {
            include: { model: Membership, as: 'membership' }
        });
        return res.status(201).json({ message: "Anggota berhasil dibuat", data: createdMemberWithMembership });
    } catch (err) {
        console.error("Error creating member:", err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Email sudah terdaftar." });
        }
        return res.status(500).json({ message: "Terjadi kesalahan server saat membuat anggota." });
    }
}

async function listMembers(req, res) {
    try {
        const members = await Member.findAll({
            attributes: ['id', 'fullName', 'email', 'phone', 'qrPath'],
            include: {
                model: Membership,
                as: "membership",
                attributes: ['status', 'packageName', 'startDate', 'endDate']
            },
            order: [["id", "DESC"]],
        });
        return res.json(members);
    } catch (err) {
        console.error("Error listing members:", err);
        return res.status(500).json({ message: "Terjadi kesalahan server." });
    }
}

async function getMember(req, res) {
    try {
        const id = req.params.id;
        if (req.user.role === "member" && parseInt(req.user.id) !== parseInt(id)) {
            return res.status(403).json({ message: "Akses ditolak" });
        }
        const member = await Member.findByPk(id, { include: { model: Membership, as: "membership" } });
        if (!member) return res.status(404).json({ message: "Anggota tidak ditemukan" });
        return res.json(member);
    } catch (err) {
        console.error("Error getting member:", err);
        return res.status(500).json({ message: "Terjadi kesalahan server." });
    }
}

async function updateMember(req, res) {
    try {
        const { id } = req.params;
        if (req.user.role === "member" && parseInt(req.user.id) !== parseInt(id)) {
            return res.status(403).json({ message: "Akses ditolak" });
        }
        const { fullName, email, phone, password, membership } = req.body;
        const result = await sequelize.transaction(async (t) => {
            const member = await Member.findByPk(id, { include: { model: Membership, as: "membership" }, transaction: t });
            if (!member) {
                throw new Error("Anggota tidak ditemukan");
            }
            const updateData = {};
            if (fullName) updateData.fullName = fullName;
            if (email) updateData.email = email;
            if (phone) updateData.phone = phone;
            if (password) updateData.password = await hashPassword(password);
            
            // Lakukan update pada tabel Member jika ada data yang dikirim
            if (Object.keys(updateData).length > 0) {
              await member.update(updateData, { transaction: t });
            }

            if (membership) {
                if (member.membership) {
                    await member.membership.update({
                        status: membership.status,
                        packageName: membership.packageName || null,
                        startDate: membership.startDate || null,
                        endDate: membership.endDate || null
                    }, { transaction: t });
                } else {
                    await Membership.create({
                        memberId: id,
                        status: membership.status,
                        packageName: membership.packageName || null,
                        startDate: membership.startDate || null,
                        endDate: membership.endDate || null
                    }, { transaction: t });
                }
            } else if (member.membership) {
                await member.membership.destroy({ transaction: t });
            }

            return await Member.findByPk(id, { include: { model: Membership, as: "membership" }, transaction: t });
        });
        return res.json({ message: "Anggota berhasil diperbarui", data: result });
    } catch (err) {
        console.error("Error updating member:", err);
        if (err.message === "Anggota tidak ditemukan") {
            return res.status(404).json({ message: "Anggota tidak ditemukan." });
        }
        return res.status(500).json({ message: "Terjadi kesalahan server saat memperbarui anggota." });
    }
}

async function deleteMember(req, res) {
    try {
        const { id } = req.params;
        const member = await Member.findByPk(id);
        if (!member) {
            return res.status(404).json({ message: "Anggota tidak ditemukan." });
        }
        await member.destroy();
        return res.status(200).json({ message: "Anggota berhasil dihapus." });
    } catch (err) {
        console.error("Error deleting member:", err);
        return res.status(500).json({ message: "Terjadi kesalahan server." });
    }
}

async function getProfile(req, res) {
    try {
        const member = await Member.findByPk(req.user.id, {
            include: { model: Membership, as: "membership" },
        });
        if (!member) {
            return res.status(404).json({ message: "Profil tidak ditemukan." });
        }
        return res.json({
            fullName: member.fullName,
            email: member.email,
            phone: member.phone,
            membership: member.membership,
            profilePictureUrl: member.profilePictureUrl,
        });
    } catch (err) {
        console.error("Error fetching profile:", err);
        return res.status(500).json({ message: "Terjadi kesalahan server." });
    }
}

async function getAttendance(req, res) {
    try {
        const memberId = req.user.id;
        const attendanceHistory = await Attendance.findAll({
            where: { memberId },
            order: [["checkInAt", "DESC"]],
            limit: 10,
        });
        return res.json(attendanceHistory);
    } catch (err) {
        console.error("Error fetching attendance history:", err);
        return res.status(500).json({ message: "Terjadi kesalahan server." });
    }
}

async function getDashboardData(req, res) {
    try {
        const totalMembers = await Member.count();
        const activeMembersCount = await Membership.count({
            where: { status: 'Aktif' }
        });
        const inactiveMembersCount = await Membership.count({
            where: { status: 'Nonaktif' }
        });
        const latestMembers = await Member.findAll({
            order: [["createdAt", "DESC"]],
            limit: 5,
            attributes: ["id", "fullName", "email", "phone", "qrPath"],
            include: {
                model: Membership,
                as: "membership",
                attributes: ["status", "packageName"]
            }
        });
        const membersWithQr = latestMembers.map(member => ({
            ...member.toJSON(),
            qrCodeUrl: member.qrPath
        }));

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyAttendance = await Attendance.findAll({
            attributes: [
                [sequelize.fn('date', sequelize.col('checkInAt')), 'date'],
                [sequelize.fn('count', sequelize.col('id')), 'count']
            ],
            where: {
                checkInAt: {
                    [Op.gte]: oneWeekAgo,
                },
            },
            group: [sequelize.fn('date', sequelize.col('checkInAt'))],
            order: [[sequelize.fn('date', sequelize.col('checkInAt')), 'ASC']],
        });
        const formattedAttendance = weeklyAttendance.map(item => ({
            date: item.get('date'),
            count: item.get('count'),
        }));
        return res.json({
            totalMembers,
            activeMembers: activeMembersCount,
            inactiveMembers: inactiveMembersCount,
            weeklyAttendance: formattedAttendance,
            latestMembers: membersWithQr
        });
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        return res.status(500).json({ message: "Terjadi kesalahan server." });
    }
}

async function uploadProfileImage(req, res) {
    try {
        const memberId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ message: "Tidak ada file yang diunggah." });
        }
        const member = await Member.findByPk(memberId);
        if (!member) {
            return res.status(404).json({ message: "Anggota tidak ditemukan." });
        }
        if (member.profilePictureUrl) {
            const oldPath = path.join(__dirname, '..', '..', member.profilePictureUrl);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        member.profilePictureUrl = `/uploads/profiles/${req.file.filename}`;
        await member.save();
        return res.json({ message: "Foto profil berhasil diunggah.", data: member });
    } catch (err) {
        console.error("Error uploading profile image:", err);
        return res.status(500).json({ message: "Terjadi kesalahan server saat mengunggah foto." });
    }
}

// FUNGSI BARU UNTUK GENERASI PDF
async function generateMembersPdf(req, res) {
    try {
        const members = await Member.findAll({
            attributes: ['id', 'fullName', 'email', 'phone', 'createdAt'],
            include: {
                model: Membership,
                as: "membership",
                attributes: ['status', 'packageName', 'startDate', 'endDate']
            },
            order: [["id", "DESC"]],
        });

        const data = members.map(member => ({
            id: member.id,
            fullName: member.fullName,
            email: member.email,
            phone: member.phone,
            joinDate: moment(member.createdAt).format('DD MMM YYYY'),
            packageName: member.membership?.packageName || 'N/A',
            status: member.membership?.status || 'Nonaktif',
            membershipPeriod: member.membership ? `${moment(member.membership.startDate).format("DD MMM YYYY")} - ${moment(member.membership.endDate).format("DD MMM YYYY")}` : 'N/A'
        }));

        let tableRowsHtml = data.map(m => `
            <tr>
                <td>${String(m.id).padStart(4, "0")}</td>
                <td>${m.fullName}</td>
                <td>${m.email}</td>
                <td>${m.phone}</td>
                <td>${m.packageName}</td>
                <td>${m.membershipPeriod}</td>
                <td>${m.status}</td>
                <td>${m.joinDate}</td>
            </tr>
        `).join('');

        const htmlContent = `
            <html>
            <head>
                <title>Laporan Anggota Fithub</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { text-align: center; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                </style>
            </head>
            <body>
                <h1>Laporan Anggota Fithub</h1>
                <p>Tanggal Cetak: ${moment().format('DD MMMM YYYY')}</p>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Telepon</th>
                            <th>Paket</th>
                            <th>Masa Berlaku</th>
                            <th>Status</th>
                            <th>Tanggal Gabung</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const options = { format: 'A4', orientation: 'landscape' };
        
        pdf.create(htmlContent, options).toBuffer((err, buffer) => {
            if (err) {
                console.error('Error generating PDF:', err);
                return res.status(500).json({ message: "Gagal membuat PDF." });
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="laporan-anggota.pdf"');
            res.send(buffer);
        });

    } catch (err) {
        console.error("Error generating members PDF:", err);
        return res.status(500).json({ message: "Terjadi kesalahan server saat membuat laporan." });
    }
}

module.exports = {
    createMember,
    listMembers,
    getMember,
    updateMember,
    deleteMember,
    getProfile,
    getAttendance,
    getDashboardData,
    uploadProfileImage: [upload.single('profileImage'), uploadProfileImage],
    generateMembersPdf,
};
