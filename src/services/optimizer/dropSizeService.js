const { Order, WarehouseCost, TransportCost, Route, DropSizeResult } = require('../../models');

/**
 * Drop-size optimizer: for each order compute min_profitable_quantity.
 * fixed_cost = transport base (base_cost + cost_per_km * distance_km)
 * unit_variable_cost = (warehouse cost + cost_per_kg * weight_kg) / quantity
 * unit_revenue = revenue / quantity
 * min_profitable_quantity = fixed_cost / (unit_revenue - unit_variable_cost) when unit_revenue > unit_variable_cost
 */
async function calculateDropSize(organizationId) {
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
    const quantity = Math.max(1, toFloat(order.quantity));
    const revenue = toFloat(order.revenue);

    const warehouseCost = pick * lines + pack * lines + palletHan * pallets;
    const tc = transportByRoute[order.route_id];
    const route = routeByRouteId[order.route_id];
    const baseCost = tc ? toFloat(tc.base_cost) : 0;
    const costPerKg = tc ? toFloat(tc.cost_per_kg) : 0;
    const costPerKm = tc ? toFloat(tc.cost_per_km) : 0;
    const distanceKm = route ? toFloat(route.distance_km) : 0;

    const fixedCost = baseCost + costPerKm * distanceKm;
    const variableCostOrder = warehouseCost + costPerKg * weightKg;
    const unitVariableCost = variableCostOrder / quantity;
    const unitRevenue = revenue / quantity;

    let minProfitableQuantity = null;
    const margin = unitRevenue - unitVariableCost;
    if (margin > 0 && fixedCost >= 0) {
      minProfitableQuantity = fixedCost / margin;
    }

    rows.push({
      order_id: order.order_id,
      organization_id: organizationId,
      fixed_cost: fixedCost,
      unit_variable_cost: unitVariableCost,
      unit_revenue: unitRevenue,
      min_profitable_quantity: minProfitableQuantity
    });
  }

  await DropSizeResult.destroy({ where: { organization_id: organizationId } });
  if (rows.length > 0) {
    await DropSizeResult.bulkCreate(rows);
  }
  return { calculated: rows.length };
}

module.exports = {
  calculateDropSize
};
