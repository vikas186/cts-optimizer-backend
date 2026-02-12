const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Route = sequelize.define('Route', {
  route_id: {
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
  distance_km: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'routes',
  timestamps: false,
  underscored: true
});

module.exports = Route;

