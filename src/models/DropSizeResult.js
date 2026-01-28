const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DropSizeResult = sequelize.define('DropSizeResult', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'order_id'
    }
  },
  organization_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'organizations',
      key: 'id'
    }
  },
  fixed_cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  unit_variable_cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  unit_revenue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  min_profitable_quantity: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  calculated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'drop_size_results',
  timestamps: false,
  underscored: true
});

module.exports = DropSizeResult;

