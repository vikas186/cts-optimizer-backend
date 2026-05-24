const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/reporting/reportController');
const { authenticate } = require('../../middleware/auth/auth');

router.get('/customer-summary', authenticate, reportController.getCustomerSummary);
router.get('/sku-summary', authenticate, reportController.getSkuSummary);
router.get('/route-summary', authenticate, reportController.getRouteSummary);
router.get('/shipment-validation', authenticate, reportController.getShipmentValidation);
router.get('/unprofitable-customers', authenticate, reportController.getUnprofitableCustomers);
router.get('/low-drop-size-customers', authenticate, reportController.getLowDropSizeCustomers);
router.get('/high-cost-skus', authenticate, reportController.getHighCostSkus);
router.get('/margin-leakage', authenticate, reportController.getMarginLeakage);
router.get('/top-10-opportunities', authenticate, reportController.getTop10Opportunities);

module.exports = router;
