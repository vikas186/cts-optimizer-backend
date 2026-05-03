const path = require('path');
const { writeCsv } = require('../utils/csvWriter');

function identifyUnprofitableCustomers(customerSummaryRows, outputDir) {
  const unprofitable = customerSummaryRows.filter(row => parseFloat(row.total_profit) < 0);
  
  const outputRows = unprofitable.map(row => ({
    customer_id: row.customer_id,
    total_revenue: row.total_revenue,
    total_cts: row.total_cts,
    total_profit: row.total_profit,
    margin_pct: row.margin_pct
  }));

  writeCsv(path.join(outputDir, 'unprofitable_customers.csv'), outputRows);
  return outputRows;
}

module.exports = { identifyUnprofitableCustomers };
