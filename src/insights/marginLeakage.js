const path = require('path');
const { writeCsv } = require('../utils/csvWriter');
const { roundMoney } = require('../utils/mathHelpers');

function generateMarginLeakage(results, outputDir) {
  const lossOrders = results.filter((row) => (parseFloat(row.profit) || 0) < 0);
  const leakageRecords = [];

  const dimensions = [
    { name: 'customer_id', field: 'customer_id' },
    { name: 'sku', field: 'sku' },
    { name: 'route_id', field: 'route_id' }
  ];

  for (const dim of dimensions) {
    const dimMap = new Map();

    for (const row of lossOrders) {
      const val = row[dim.field];
      if (val === undefined || val === null || val === '') continue;

      if (!dimMap.has(val)) {
        dimMap.set(val, { total_loss: 0, number_of_loss_orders: 0 });
      }
      const entry = dimMap.get(val);
      entry.total_loss += Math.abs(parseFloat(row.profit) || 0);
      entry.number_of_loss_orders += 1;
    }

    for (const [val, entry] of dimMap.entries()) {
      leakageRecords.push({
        dimension: dim.name,
        dimension_value: val,
        total_loss: roundMoney(entry.total_loss).toFixed(2),
        number_of_loss_orders: entry.number_of_loss_orders
      });
    }
  }

  leakageRecords.sort((a, b) => parseFloat(b.total_loss) - parseFloat(a.total_loss));
  writeCsv(path.join(outputDir, 'margin_leakage.csv'), leakageRecords);
  return leakageRecords;
}

module.exports = { generateMarginLeakage };
