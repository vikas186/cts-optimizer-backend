const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WarehouseCost = sequelize.define('WarehouseCost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
  pick_cost_per_line: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  pack_cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  pallet_handling_cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  storage_cost_per_day: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  effective_from: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'warehouse_costs',
  timestamps: false,
  underscored: true
});

module.exports = WarehouseCost;

