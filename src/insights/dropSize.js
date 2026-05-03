const path = require('path');
const { writeCsv } = require('../utils/csvWriter');

function identifyLowDropSizeCustomers(customerSummaryRows, outputDir) {
  const lowDrop = customerSummaryRows.filter(row => {
      const avgQty = parseFloat(row.avg_order_quantity) || 0;
      const avgQmin = parseFloat(row.avg_q_min) || 0;
      return avgQty < avgQmin;
  });
  
  writeCsv(path.join(outputDir, 'low_drop_size_customers.csv'), lowDrop);
  return lowDrop;
}

module.exports = { identifyLowDropSizeCustomers };
