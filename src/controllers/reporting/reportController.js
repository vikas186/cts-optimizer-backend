const reportService = require('../../services/reporting/reportService');

function sendReport(req, res, next, reportKey) {
  try {
    const { filename, content } = reportService.getReportCsv(reportKey);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(content);
  } catch (error) {
    next(error);
  }
}

const getCustomerSummary = (req, res, next) => sendReport(req, res, next, 'customer-summary');
const getSkuSummary = (req, res, next) => sendReport(req, res, next, 'sku-summary');
const getRouteSummary = (req, res, next) => sendReport(req, res, next, 'route-summary');
const getShipmentValidation = (req, res, next) => sendReport(req, res, next, 'shipment-validation');
const getUnprofitableCustomers = (req, res, next) => sendReport(req, res, next, 'unprofitable-customers');
const getLowDropSizeCustomers = (req, res, next) => sendReport(req, res, next, 'low-drop-size-customers');
const getHighCostSkus = (req, res, next) => sendReport(req, res, next, 'high-cost-skus');
const getMarginLeakage = (req, res, next) => sendReport(req, res, next, 'margin-leakage');
const getTop10Opportunities = (req, res, next) => sendReport(req, res, next, 'top-10-opportunities');

module.exports = {
  getCustomerSummary,
  getSkuSummary,
  getRouteSummary,
  getShipmentValidation,
  getUnprofitableCustomers,
  getLowDropSizeCustomers,
  getHighCostSkus,
  getMarginLeakage,
  getTop10Opportunities
};
