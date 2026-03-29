const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Customer = sequelize.define('Customer', {
  customer_id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  organization_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'organizations',
      key: 'id'
    }
  },
  segment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  revenue_per_unit: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'customers',
  timestamps: false,
  underscored: true
});

module.exports = Customer;

