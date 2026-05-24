const path = require('path');
const { identifyUnprofitableCustomers } = require('./unprofitable');
const { identifyLowDropSizeCustomers } = require('./dropSize');
const { identifyHighCostSkus } = require('./skuAnalysis');
const { generateMarginLeakage } = require('./marginLeakage');
const { generateTopOpportunities } = require('./opportunities');

async function runAllInsights(customerSummary, skuSummary, ordersData, outputDir) {
  const unprofitable = identifyUnprofitableCustomers(customerSummary, outputDir);
  const lowDropSize = identifyLowDropSizeCustomers(customerSummary, outputDir);
  const highCostSkus = identifyHighCostSkus(skuSummary, outputDir);
  const marginLeakage = generateMarginLeakage(ordersData, outputDir);
  const topOpportunities = generateTopOpportunities(ordersData, outputDir);

  const files = {
    unprofitable_customers: path.join(outputDir, 'unprofitable_customers.csv'),
    low_drop_size_customers: path.join(outputDir, 'low_drop_size_customers.csv'),
    high_cost_skus: path.join(outputDir, 'high_cost_skus.csv'),
    margin_leakage: path.join(outputDir, 'margin_leakage.csv'),
    top_10_opportunities: path.join(outputDir, 'top_10_opportunities.csv')
  };

  return {
    unprofitable,
    lowDropSize,
    highCostSkus,
    marginLeakage,
    topOpportunities,
    files,
    counts: {
      unprofitable: unprofitable.length,
      low_drop_size: lowDropSize.length,
      high_cost_skus: highCostSkus.length,
      margin_leakage: marginLeakage.length,
      top_opportunities: topOpportunities.length
    }
  };
}

module.exports = {
  identifyUnprofitableCustomers,
  identifyLowDropSizeCustomers,
  identifyHighCostSkus,
  generateMarginLeakage,
  generateTopOpportunities,
  runAllInsights
};
