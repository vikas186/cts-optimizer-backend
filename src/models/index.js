const sequelize = require('../config/database');

// Import all models
const Organization = require('./Organization');
const User = require('./User');
const Customer = require('./Customer');
const WarehouseCost = require('./WarehouseCost');
const Route = require('./Route');
const TransportCost = require('./TransportCost');
const Order = require('./Order');
const CostResult = require('./CostResult');
const DropSizeResult = require('./DropSizeResult');

// Define associations

// Organizations → Users (1:N)
Organization.hasMany(User, {
  foreignKey: 'organization_id',
  as: 'users'
});
User.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// Organizations → Customers (1:N)
Organization.hasMany(Customer, {
  foreignKey: 'organization_id',
  as: 'customers'
});
Customer.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// Organizations → WarehouseCosts (1:N)
Organization.hasMany(WarehouseCost, {
  foreignKey: 'organization_id',
  as: 'warehouseCosts'
});
WarehouseCost.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// Organizations → Routes (1:N)
Organization.hasMany(Route, {
  foreignKey: 'organization_id',
  as: 'routes'
});
Route.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// Routes → TransportCosts (1:N)
Route.hasMany(TransportCost, {
  foreignKey: 'route_id',
  as: 'transportCosts'
});
TransportCost.belongsTo(Route, {
  foreignKey: 'route_id',
  as: 'route'
});

// Organizations → TransportCosts (1:N)
Organization.hasMany(TransportCost, {
  foreignKey: 'organization_id',
  as: 'transportCosts'
});
TransportCost.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// Customers → Orders (1:N)
Customer.hasMany(Order, {
  foreignKey: 'customer_id',
  as: 'orders'
});
Order.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer'
});

// Organizations → Orders (1:N)
Organization.hasMany(Order, {
  foreignKey: 'organization_id',
  as: 'orders'
});
Order.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// Routes → Orders (1:N)
Route.hasMany(Order, {
  foreignKey: 'route_id',
  as: 'orders'
});
Order.belongsTo(Route, {
  foreignKey: 'route_id',
  as: 'route'
});

// Orders → CostResults (1:N)
Order.hasMany(CostResult, {
  foreignKey: 'order_id',
  as: 'costResults'
});
CostResult.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// Organizations → CostResults (1:N)
Organization.hasMany(CostResult, {
  foreignKey: 'organization_id',
  as: 'costResults'
});
CostResult.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// Orders → DropSizeResults (1:N)
Order.hasMany(DropSizeResult, {
  foreignKey: 'order_id',
  as: 'dropSizeResults'
});
DropSizeResult.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// Organizations → DropSizeResults (1:N)
Organization.hasMany(DropSizeResult, {
  foreignKey: 'organization_id',
  as: 'dropSizeResults'
});
DropSizeResult.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

module.exports = {
  sequelize,
  Organization,
  User,
  Customer,
  WarehouseCost,
  Route,
  TransportCost,
  Order,
  CostResult,
  DropSizeResult
};

