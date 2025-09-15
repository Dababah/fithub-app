const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Admin extends Model {}
Admin.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING }
}, { sequelize, modelName: 'admin' });

module.exports = Admin;
