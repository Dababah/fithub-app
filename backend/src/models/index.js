// src/models/index.js
const sequelize = require('../config/database');
const Admin = require('./Admin');
const Member = require('./Member');
const Attendance = require('./Attendance');
const Membership = require('./Membership');

// Asosiasi Member dengan Attendance
// Seorang member memiliki banyak riwayat absensi (satu-ke-banyak)
Member.hasMany(Attendance, { 
  foreignKey: 'memberId', 
  as: 'attendances',
  onDelete: 'CASCADE' 
});
Attendance.belongsTo(Member, { foreignKey: 'memberId' });

// Asosiasi Member dengan Membership
// Seorang member memiliki satu membership (satu-ke-satu)
Member.hasOne(Membership, { 
  foreignKey: 'memberId', 
  as: 'membership',
  onDelete: 'CASCADE' 
});
Membership.belongsTo(Member, { foreignKey: 'memberId' });

// Ekspor semua model dan koneksi sequelize
module.exports = {
  sequelize,
  Admin,
  Member,
  Attendance,
  Membership
};