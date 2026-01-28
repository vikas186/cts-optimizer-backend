const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TransportCost = sequelize.define('TransportCost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  route_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'routes',
      key: 'route_id'
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
  base_cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  cost_per_kg: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  cost_per_km: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'transport_costs',
  timestamps: false,
  underscored: true
});

module.exports = TransportCost;

