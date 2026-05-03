const path = require('path');
const { writeCsv } = require('../utils/csvWriter');

function generateRouteSummary(results, outputDir) {
  const routeMap = new Map();

  for (const row of results) {
    const rid = row.route_id;
    if (!routeMap.has(rid)) {
      routeMap.set(rid, {
        route_id: rid,
        shipments: new Set(),
        total_orders: 0,
        total_revenue: 0,
        total_cts: 0,
        total_quantity: 0
      });
    }

    const r = routeMap.get(rid);
    r.shipments.add(row.shipment_id);
    r.total_orders += 1;
    r.total_revenue += parseFloat(row.revenue) || 0;
    r.total_cts += parseFloat(row.cost_to_serve) || 0;
    r.total_quantity += parseFloat(row.quantity) || 0;
  }

  const outputRows = [];
  for (const r of routeMap.values()) {
    const total_profit = r.total_revenue - r.total_cts;
    const total_shipments = r.shipments.size;
    const avg_cost_per_shipment = total_shipments > 0 ? r.total_cts / total_shipments : 0;
    const avg_drop_size = total_shipments > 0 ? r.total_quantity / total_shipments : 0;

    outputRows.push({
      route_id: r.route_id,
      total_shipments: total_shipments,
      total_orders: r.total_orders,
      total_revenue: r.total_revenue.toFixed(2),
      total_cts: r.total_cts.toFixed(2),
      total_profit: total_profit.toFixed(2),
      avg_cost_per_shipment: avg_cost_per_shipment.toFixed(2),
      avg_drop_size: avg_drop_size.toFixed(2)
    });
  }

  writeCsv(path.join(outputDir, 'route_summary.csv'), outputRows);
  return outputRows;
}

module.exports = { generateRouteSummary };
