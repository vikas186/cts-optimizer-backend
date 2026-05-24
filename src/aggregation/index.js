const path = require('path');
const { generateCustomerSummary } = require('./customer');
const { generateSkuSummary } = require('./sku');
const { generateRouteSummary } = require('./route');
const { validateShipments } = require('./shipmentValidation');

async function runAllAggregations(ordersData, outputDir) {
  const customerSummary = generateCustomerSummary(ordersData, outputDir);
  const skuSummary = generateSkuSummary(ordersData, outputDir);
  const routeSummary = generateRouteSummary(ordersData, outputDir);
  const shipmentValidation = validateShipments(ordersData, outputDir);

  const files = {
    customer_summary: path.join(outputDir, 'customer_summary.csv'),
    sku_summary: path.join(outputDir, 'sku_summary.csv'),
    route_summary: path.join(outputDir, 'route_summary.csv'),
    shipment_validation: path.join(outputDir, 'shipment_validation.csv')
  };

  return {
    customerSummary,
    skuSummary,
    routeSummary,
    shipmentValidation,
    files,
    counts: {
      customers: customerSummary.length,
      skus: skuSummary.length,
      routes: routeSummary.length,
      shipments: shipmentValidation.length
    }
  };
}

module.exports = {
  generateCustomerSummary,
  generateSkuSummary,
  generateRouteSummary,
  validateShipments,
  runAllAggregations
};
