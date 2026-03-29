const express = require('express');
const router = express.Router();
const exportController = require('../../controllers/reporting/exportController');
const { authenticate } = require('../../middleware/auth/auth');

/**
 * @swagger
 * /api/export/cost-results:
 *   get:
 *     summary: Export cost results as CSV
 *     description: Returns cost-to-serve results (order_id, transport_cost, warehouse_cost, cost_to_serve, profit, profitable) as CSV. Query `includeOrder=1` to add order fields (customer_id, route_id, sku, quantity, revenue, etc.).
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: includeOrder
 *         schema:
 *           type: string
 *           enum: ['1', 'true']
 *         description: Add order columns to the CSV
 *     responses:
 *       200:
 *         description: CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/cost-results', authenticate, exportController.exportCostResults);

/**
 * @swagger
 * /api/export/drop-size-results:
 *   get:
 *     summary: Export drop-size results as CSV
 *     description: Returns drop-size recommendations (order_id, fixed_cost, unit_variable_cost, unit_revenue, min_profitable_quantity) as CSV.
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/drop-size-results', authenticate, exportController.exportDropSizeResults);

/**
 * @swagger
 * /api/export/orders-with-analytics:
 *   get:
 *     summary: Export orders with cost and drop-size analytics as CSV
 *     description: Full report CSV combining orders with cost-to-serve and drop-size fields. Use for profitability dashboard export.
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/orders-with-analytics', authenticate, exportController.exportOrdersWithAnalytics);

module.exports = router;
