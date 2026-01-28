const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  order_id: {
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
  customer_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'customer_id'
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
  sku: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  revenue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  weight_kg: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  volume_m3: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lines: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pallets: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  order_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: false,
  underscored: true
});

module.exports = Order;

