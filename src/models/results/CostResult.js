const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const CostResult = sequelize.define('CostResult', {
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
  transport_cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  warehouse_cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  admin_cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  return_cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  cost_to_serve: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  profit: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  profitable: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  calculated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cost_results',
  timestamps: false,
  underscored: true
});

module.exports = CostResult;

