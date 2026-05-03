const path = require('path');
const { writeCsv } = require('../utils/csvWriter');

function generateSkuSummary(results, outputDir) {
  const skuMap = new Map();

  for (const row of results) {
    const sku = row.sku;
    if (!skuMap.has(sku)) {
      skuMap.set(sku, {
        sku: sku,
        total_revenue: 0,
        total_cts: 0,
        total_quantity: 0,
        total_variable_cost: 0,
        count: 0
      });
    }

    const s = skuMap.get(sku);
    s.total_revenue += parseFloat(row.revenue) || 0;
    s.total_cts += parseFloat(row.cost_to_serve) || 0;
    s.total_quantity += parseFloat(row.quantity) || 0;
    s.total_variable_cost += parseFloat(row.variable_cost_per_unit) || 0;
    s.count += 1;
  }

  const outputRows = [];
  for (const s of skuMap.values()) {
    const total_profit = s.total_revenue - s.total_cts;
    const margin_pct = s.total_revenue !== 0 ? total_profit / s.total_revenue : 0;
    const cost_per_unit = s.total_quantity !== 0 ? s.total_cts / s.total_quantity : 0;
    const avg_variable_cost_per_unit = s.count > 0 ? s.total_variable_cost / s.count : 0;

    outputRows.push({
      sku: s.sku,
      total_revenue: s.total_revenue.toFixed(2),
      total_cts: s.total_cts.toFixed(2),
      total_profit: total_profit.toFixed(2),
      margin_pct: margin_pct.toFixed(4),
      total_quantity: s.total_quantity.toFixed(2),
      cost_per_unit: cost_per_unit.toFixed(2),
      avg_variable_cost_per_unit: avg_variable_cost_per_unit.toFixed(2)
    });
  }

  writeCsv(path.join(outputDir, 'sku_summary.csv'), outputRows);
  return outputRows;
}

module.exports = { generateSkuSummary };
