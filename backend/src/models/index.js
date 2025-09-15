const sequelize = require('../config/database');
const Admin = require('./Admin');
const Member = require('./Member');
const Attendance = require('./Attendance');
const Membership = require('./Membership');

// Associations
Member.hasMany(Attendance, { foreignKey: 'memberId', onDelete: 'CASCADE' });
Attendance.belongsTo(Member, { foreignKey: 'memberId' });

Member.hasOne(Membership, { foreignKey: 'memberId', onDelete: 'CASCADE' });
Membership.belongsTo(Member, { foreignKey: 'memberId' });

module.exports = {
  sequelize,
  Admin,
  Member,
  Attendance,
  Membership
};
