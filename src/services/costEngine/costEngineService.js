const { Order, WarehouseCost, TransportCost, Route, CostResult } = require('../../models');

/**
 * Cost-to-serve calculation per order.
 * Warehouse cost = pick_cost_per_line * lines + pack_cost * lines + pallet_handling_cost * pallets
 * Transport cost = base_cost + cost_per_kg * weight_kg + cost_per_km * distance_km (for order's route)
 * cost_to_serve = warehouse_cost + transport_cost + admin_cost + return_cost
 * profit = revenue - cost_to_serve; profitable = profit > 0
 */
async function calculateCostToServe(organizationId) {
  const orders = await Order.findAll({
    where: { organization_id: organizationId }
  });
  if (orders.length === 0) {
    return { calculated: 0, message: 'No orders to calculate' };
  }

  const [warehouseCosts, transportCosts, routes] = await Promise.all([
    WarehouseCost.findAll({ where: { organization_id: organizationId }, order: [['effective_from', 'DESC NULLS LAST']] }),
    TransportCost.findAll({ where: { organization_id: organizationId } }),
    Route.findAll({ where: { organization_id: organizationId } })
  ]);

  const wh = warehouseCosts[0] || {};
  const transportByRoute = {};
  transportCosts.forEach(t => { transportByRoute[t.route_id] = t; });
  const routeByRouteId = {};
  routes.forEach(r => { routeByRouteId[r.route_id] = r; });

  const toFloat = (v) => (v != null && v !== '' ? Number(v) : 0);
  const pick = toFloat(wh.pick_cost_per_line);
  const pack = toFloat(wh.pack_cost);
  const palletHan = toFloat(wh.pallet_handling_cost);

  const rows = [];
  for (const order of orders) {
    const lines = Math.max(0, toFloat(order.lines));
    const pallets = Math.max(0, toFloat(order.pallets));
    const weightKg = Math.max(0, toFloat(order.weight_kg));
    const revenue = toFloat(order.revenue);

    const warehouseCost = pick * lines + pack * lines + palletHan * pallets;

    const tc = transportByRoute[order.route_id];
    const route = routeByRouteId[order.route_id];
    const baseCost = tc ? toFloat(tc.base_cost) : 0;
    const costPerKg = tc ? toFloat(tc.cost_per_kg) : 0;
    const costPerKm = tc ? toFloat(tc.cost_per_km) : 0;
    const distanceKm = route ? toFloat(route.distance_km) : 0;
    const transportCost = baseCost + costPerKg * weightKg + costPerKm * distanceKm;

    const adminCost = 0;
    const returnCost = 0;
    const costToServe = warehouseCost + transportCost + adminCost + returnCost;
    const profit = revenue - costToServe;
    const profitable = profit > 0;

    rows.push({
      order_id: order.order_id,
      organization_id: organizationId,
      transport_cost: transportCost,
      warehouse_cost: warehouseCost,
      admin_cost: adminCost,
      return_cost: returnCost,
      cost_to_serve: costToServe,
      profit,
      profitable
    });
  }

  await CostResult.destroy({ where: { organization_id: organizationId } });
  if (rows.length > 0) {
    await CostResult.bulkCreate(rows);
  }
  return { calculated: rows.length };
}

module.exports = {
  calculateCostToServe
};
