const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Shipment = sequelize.define('Shipment', {
  shipment_id: {
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
  route_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'routes',
      key: 'route_id'
    }
  },
  total_weight_kg: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  total_pallets: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  shipment_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'shipments',
  timestamps: false,
  underscored: true
});

module.exports = Shipment;
