/**
 * Clear all CTS/Excel-related data from the database (all organizations).
 * Keeps: organizations, users.
 * Deletes: cost_results, drop_size_results, orders, transport_costs, warehouse_costs, routes, customers.
 *
 * Usage: node scripts/clear-db.js
 * (Ensure .env is loaded or set DATABASE_URL / config so sequelize can connect.)
 */

require('dotenv').config();
const { sequelize, CostResult, DropSizeResult, Order, Shipment, TransportCost, WarehouseCost, Route, Customer } = require('../src/models');

async function clearDb() {
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }

  const order = [
    CostResult,
    DropSizeResult,
    Order,
    Shipment,
    TransportCost,
    WarehouseCost,
    Route,
    Customer
  ];

  for (const model of order) {
    const n = await model.destroy({ where: {}, force: true });
    console.log(`${model.name}: ${n} row(s) deleted`);
  }

  console.log('DB clear done. Organizations and users are unchanged.');
  await sequelize.close();
  process.exit(0);
}

clearDb().catch((err) => {
  console.error(err);
  process.exit(1);
});
