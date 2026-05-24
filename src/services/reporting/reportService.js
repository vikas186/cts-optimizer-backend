const fs = require('fs');
const path = require('path');

const REPORT_FILES = {
  'customer-summary': 'customer_summary.csv',
  'sku-summary': 'sku_summary.csv',
  'route-summary': 'route_summary.csv',
  'shipment-validation': 'shipment_validation.csv',
  'unprofitable-customers': 'unprofitable_customers.csv',
  'low-drop-size-customers': 'low_drop_size_customers.csv',
  'high-cost-skus': 'high_cost_skus.csv',
  'margin-leakage': 'margin_leakage.csv',
  'top-10-opportunities': 'top_10_opportunities.csv'
};

function getReportCsv(reportKey) {
  const filename = REPORT_FILES[reportKey];
  if (!filename) {
    const err = new Error(`Unknown report: ${reportKey}`);
    err.statusCode = 404;
    throw err;
  }

  const filePath = path.join(process.cwd(), 'output', filename);
  if (!fs.existsSync(filePath)) {
    const err = new Error(`Report file not found. Run cost-to-serve calculation first.`);
    err.statusCode = 404;
    throw err;
  }

  return { filename, content: fs.readFileSync(filePath, 'utf8') };
}

module.exports = { getReportCsv, REPORT_FILES };
