const { CostResult, DropSizeResult, Order } = require('../../models');
const { Op } = require('sequelize');

function escapeCsvCell(value) {
  if (value == null) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsvRow(arr) {
  return arr.map(escapeCsvCell).join(',');
}

/**
 * Export cost results as CSV (with order_id and key cost fields). Optionally join order fields.
 */
async function exportCostResultsCsv(organizationId, options = {}) {
  const { includeOrderFields = false } = options;
  const results = await CostResult.findAll({
    where: { organization_id: organizationId },
    order: [['calculated_at', 'DESC']],
    include: includeOrderFields ? [{ model: Order, as: 'order', required: false, attributes: ['order_id', 'customer_id', 'route_id', 'sku', 'quantity', 'revenue', 'weight_kg', 'lines', 'pallets', 'order_date'] }] : []
  });

  const headers = ['order_id', 'transport_cost', 'warehouse_cost', 'admin_cost', 'return_cost', 'cost_to_serve', 'profit', 'profitable'];
  if (includeOrderFields) {
    headers.push('customer_id', 'route_id', 'sku', 'quantity', 'revenue', 'weight_kg', 'lines', 'pallets', 'order_date');
  }
  const lines = [toCsvRow(headers)];
  for (const r of results) {
    const row = [
      r.order_id,
      r.transport_cost,
      r.warehouse_cost,
      r.admin_cost,
      r.return_cost,
      r.cost_to_serve,
      r.profit,
      r.profitable
    ];
    if (includeOrderFields && r.order) {
      const o = r.order;
      row.push(
        o.customer_id,
        o.route_id,
        o.sku,
        o.quantity,
        o.revenue,
        o.weight_kg,
        o.lines,
        o.pallets,
        o.order_date
      );
    }
    lines.push(toCsvRow(row));
  }
  return lines.join('\r\n');
}

/**
 * Export drop-size results as CSV.
 */
async function exportDropSizeResultsCsv(organizationId) {
  const results = await DropSizeResult.findAll({
    where: { organization_id: organizationId },
    order: [['calculated_at', 'DESC']]
  });

  const headers = ['order_id', 'fixed_cost', 'unit_variable_cost', 'unit_revenue', 'min_profitable_quantity'];
  const lines = [toCsvRow(headers)];
  for (const r of results) {
    lines.push(toCsvRow([r.order_id, r.fixed_cost, r.unit_variable_cost, r.unit_revenue, r.min_profitable_quantity]));
  }
  return lines.join('\r\n');
}

/**
 * Export orders with cost and drop-size (joined) as CSV for full report.
 */
async function exportOrdersWithAnalyticsCsv(organizationId) {
  const orders = await Order.findAll({
    where: { organization_id: organizationId },
    order: [['order_date', 'DESC'], ['order_id', 'ASC']]
  });
  const orderIds = orders.map(o => o.order_id);
  const [costResults, dropResults] = await Promise.all([
    CostResult.findAll({ where: { organization_id: organizationId, order_id: { [Op.in]: orderIds } } }),
    DropSizeResult.findAll({ where: { organization_id: organizationId, order_id: { [Op.in]: orderIds } } })
  ]);
  const costByOrder = {};
  costResults.forEach(c => { costByOrder[c.order_id] = c; });
  const dropByOrder = {};
  dropResults.forEach(d => { dropByOrder[d.order_id] = d; });

  const headers = [
    'order_id', 'customer_id', 'route_id', 'sku', 'quantity', 'revenue', 'weight_kg', 'volume_m3', 'lines', 'pallets', 'order_date',
    'transport_cost', 'warehouse_cost', 'cost_to_serve', 'profit', 'profitable',
    'fixed_cost', 'unit_variable_cost', 'unit_revenue', 'min_profitable_quantity'
  ];
  const lines = [toCsvRow(headers)];
  for (const o of orders) {
    const c = costByOrder[o.order_id];
    const d = dropByOrder[o.order_id];
    lines.push(toCsvRow([
      o.order_id, o.customer_id, o.route_id, o.sku, o.quantity, o.revenue, o.weight_kg, o.volume_m3, o.lines, o.pallets, o.order_date,
      c ? c.transport_cost : '', c ? c.warehouse_cost : '', c ? c.cost_to_serve : '', c ? c.profit : '', c ? c.profitable : '',
      d ? d.fixed_cost : '', d ? d.unit_variable_cost : '', d ? d.unit_revenue : '', d ? d.min_profitable_quantity : ''
    ]));
  }
  return lines.join('\r\n');
}

module.exports = {
  exportCostResultsCsv,
  exportDropSizeResultsCsv,
  exportOrdersWithAnalyticsCsv
};
