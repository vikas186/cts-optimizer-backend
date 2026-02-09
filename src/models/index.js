const sequelize = require('../config/database');

// Import all models
const Organization = require('./auth/Organization');
const User = require('./auth/User');
const Customer = require('./core/Customer');
const Route = require('./core/Route');
const WarehouseCost = require('./costs/WarehouseCost');
const TransportCost = require('./costs/TransportCost');
const Order = require('./orders/Order');
const CostResult = require('./results/CostResult');
const DropSizeResult = require('./results/DropSizeResult');

// Define associations according to ER Diagram

// ============================================
// ORGANIZATIONS Associations (Central Entity)
// ============================================

// Organizations → Users (1:N) - "has"
Organization.hasMany(User, {
  foreignKey: 'organization_id',
  as: 'users'
});
User.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// Organizations → Customers (1:N) - "owns"
Organization.hasMany(Customer, {
  foreignKey: 'organization_id',
  as: 'customers'
});
Customer.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// Organizations → WarehouseCosts (1:N) - "defines"
Organization.hasMany(WarehouseCost, {
  foreignKey: 'organization_id',
  as: 'warehouseCosts'
});
WarehouseCost.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// Organizations → Routes (1:N) - "owns"
Organization.hasMany(Route, {
  foreignKey: 'organization_id',
  as: 'routes'
});
Route.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
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

// Organizations → Orders (1:N)
Organization.hasMany(Order, {
  foreignKey: 'organization_id',
  as: 'orders'
});
Order.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
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

// Organizations → DropSizeResults (1:N)
Organization.hasMany(DropSizeResult, {
  foreignKey: 'organization_id',
  as: 'dropSizeResults'
});
DropSizeResult.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

// ============================================
// ROUTES Associations
// ============================================

// Routes → TransportCosts (1:N) - "has"
Route.hasMany(TransportCost, {
  foreignKey: 'route_id',
  as: 'transportCosts'
});
TransportCost.belongsTo(Route, {
  foreignKey: 'route_id',
  as: 'route'
});

// Routes → Orders (1:N) - "associated with"
Route.hasMany(Order, {
  foreignKey: 'route_id',
  as: 'orders'
});
Order.belongsTo(Route, {
  foreignKey: 'route_id',
  as: 'route'
});

// ============================================
// CUSTOMERS Associations
// ============================================

// Customers → Orders (1:N) - "places"
Customer.hasMany(Order, {
  foreignKey: 'customer_id',
  as: 'orders'
});
Order.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer'
});

// ============================================
// ORDERS Associations
// ============================================

// Orders → CostResults (1:N) - "generates"
Order.hasMany(CostResult, {
  foreignKey: 'order_id',
  as: 'costResults'
});
CostResult.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// Orders → DropSizeResults (1:N) - "optimized_for"
Order.hasMany(DropSizeResult, {
  foreignKey: 'order_id',
  as: 'dropSizeResults'
});
DropSizeResult.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
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

