const path = require('path');
const { writeCsv } = require('../utils/csvWriter');

function generateCustomerSummary(results, outputDir) {
  const customerMap = new Map();

  for (const row of results) {
    const cid = row.customer_id;
    if (!customerMap.has(cid)) {
      customerMap.set(cid, {
        customer_id: cid,
        total_revenue: 0,
        total_cts: 0,
        total_orders: 0,
        total_quantity: 0,
        total_q_min: 0,
        orders_below_qmin: 0
      });
    }

    const c = customerMap.get(cid);
    const rev = parseFloat(row.revenue) || 0;
    const cts = parseFloat(row.cost_to_serve) || 0;
    const qty = parseFloat(row.quantity) || 0;
    const qMin = parseFloat(row.q_min) || 0;

    c.total_revenue += rev;
    c.total_cts += cts;
    c.total_orders += 1;
    c.total_quantity += qty;
    c.total_q_min += qMin;
    if (qty < qMin) {
      c.orders_below_qmin += 1;
    }
  }

  const outputRows = [];
  for (const c of customerMap.values()) {
    const total_profit = c.total_revenue - c.total_cts;
    const margin_pct = c.total_revenue !== 0 ? total_profit / c.total_revenue : 0;
    const avg_order_quantity = c.total_orders > 0 ? c.total_quantity / c.total_orders : 0;
    const avg_q_min = c.total_orders > 0 ? c.total_q_min / c.total_orders : 0;
    const pct_orders_below_qmin = c.total_orders > 0 ? c.orders_below_qmin / c.total_orders : 0;

    outputRows.push({
      customer_id: c.customer_id,
      total_revenue: c.total_revenue.toFixed(2),
      total_cts: c.total_cts.toFixed(2),
      total_profit: total_profit.toFixed(2),
      margin_pct: margin_pct.toFixed(4),
      total_orders: c.total_orders,
      avg_order_quantity: avg_order_quantity.toFixed(2),
      avg_q_min: avg_q_min.toFixed(2),
      pct_orders_below_qmin: pct_orders_below_qmin.toFixed(4)
    });
  }

  writeCsv(path.join(outputDir, 'customer_summary.csv'), outputRows);
  return outputRows;
}

module.exports = { generateCustomerSummary };
