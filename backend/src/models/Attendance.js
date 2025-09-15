const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Attendance extends Model {}
Attendance.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  memberId: { type: DataTypes.INTEGER, allowNull: false },
  checkInAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  method: { type: DataTypes.STRING, defaultValue: 'QR' }
}, { sequelize, modelName: 'attendance' });

module.exports = Attendance;
