const express = require('express');
const router = express.Router();
const calculateController = require('../../controllers/calculate/calculateController');
const { authenticate } = require('../../middleware/auth/auth');

/**
 * @swagger
 * /api/calculate/cost-to-serve:
 *   post:
 *     summary: Calculate cost-to-serve for all orders
 *     description: Runs the cost engine for the current organization. Computes warehouse + transport cost per order, profit, and saves to cost_results. Requires orders, warehouse_costs, and transport_costs to be loaded (e.g. via Excel upload).
 *     tags: [Calculate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Calculation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     calculated:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/cost-to-serve', authenticate, calculateController.runCostToServe);

/**
 * @swagger
 * /api/calculate/drop-size:
 *   post:
 *     summary: Calculate drop-size recommendations
 *     description: Runs the drop-size optimizer for the current organization. Computes min_profitable_quantity per order and saves to drop_size_results. Run after cost-to-serve or with same data.
 *     tags: [Calculate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Calculation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     calculated:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/drop-size', authenticate, calculateController.runDropSize);

/**
 * @swagger
 * /api/calculate/all:
 *   post:
 *     summary: Run cost-to-serve and drop-size calculations
 *     description: Runs both the cost engine and drop-size optimizer in one request.
 *     tags: [Calculate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Both calculations completed
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/all', authenticate, calculateController.runAll);

module.exports = router;
