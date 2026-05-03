const fs = require('fs');
const path = require('path');

async function identifyMarginLeakage(ordersData, outputDir) {
  const lossOrders = ordersData.filter(o => o.profit < 0);
  
  const leakageMap = new Map();

  for (const o of lossOrders) {
    const loss = Math.abs(o.profit); // total loss is positive value
    const dims = [
      { type: 'customer_id', val: o.customer_id },
      { type: 'sku', val: o.sku },
      { type: 'route_id', val: o.route_id }
    ];

    for (const d of dims) {
      if (d.val) {
        const key = `${d.type}::${d.val}`;
        if (!leakageMap.has(key)) {
          leakageMap.set(key, { dimension_type: d.type, dimension: d.val, total_loss: 0, number_of_loss_orders: 0 });
        }
        const entry = leakageMap.get(key);
        entry.total_loss += loss;
        entry.number_of_loss_orders += 1;
      }
    }
  }

  const results = Array.from(leakageMap.values()).map(r => ({
    ...r,
    total_loss: Number(r.total_loss.toFixed(2))
  }));

  // Sort descending by total_loss
  results.sort((a, b) => b.total_loss - a.total_loss);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const headers = ['dimension', 'total_loss', 'number_of_loss_orders'];
  const lines = [headers.join(',')];
  for (const r of results) {
    lines.push(headers.map(h => r[h]).join(','));
  }
  fs.writeFileSync(path.join(outputDir, 'margin_leakage.csv'), lines.join('\n'));
  return results;
}

module.exports = { identifyMarginLeakage };
