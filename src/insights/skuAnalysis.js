const path = require('path');
const { writeCsv } = require('../utils/csvWriter');

function identifyHighCostSkus(skuSummaryRows, outputDir, threshold = 50) {
  let highCost = skuSummaryRows;
  
  if (threshold > 0) {
      highCost = highCost.filter(row => (parseFloat(row.total_quantity) || 0) > threshold);
  }

  // Rank by cost_per_unit DESC
  highCost.sort((a, b) => {
      const costA = parseFloat(a.cost_per_unit) || 0;
      const costB = parseFloat(b.cost_per_unit) || 0;
      return costB - costA;
  });

  writeCsv(path.join(outputDir, 'high_cost_skus.csv'), highCost);
  return highCost;
}

module.exports = { identifyHighCostSkus };
