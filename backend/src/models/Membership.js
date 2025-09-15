const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Membership extends Model {}
Membership.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  memberId: { type: DataTypes.INTEGER, allowNull: false },
  packageName: { type: DataTypes.STRING },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING, defaultValue: 'Nonaktif' }
}, { sequelize, modelName: 'membership' });

module.exports = Membership;