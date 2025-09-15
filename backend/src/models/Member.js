const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Member extends Model {}
Member.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, allowNull: false },
  qrToken: { type: DataTypes.STRING, unique: true },
  qrPath: { type: DataTypes.STRING }
}, { sequelize, modelName: 'member' });

module.exports = Member;
