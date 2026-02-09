const express = require('express');
const router = express.Router();
const costResultController = require('../../controllers/results/costResultController');
const { authenticate } = require('../../middleware/auth/auth');

/**
 * @swagger
 * /api/cost-results:
 *   get:
 *     summary: Get all cost results
 *     tags: [Cost Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cost results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CostResult'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, costResultController.getAll);

/**
 * @swagger
 * /api/cost-results/{id}:
 *   get:
 *     summary: Get cost result by ID
 *     tags: [Cost Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cost result details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CostResult'
 *       404:
 *         description: Cost result not found
 */
router.get('/:id', authenticate, costResultController.getById);

/**
 * @swagger
 * /api/cost-results:
 *   post:
 *     summary: Create a new cost result
 *     tags: [Cost Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - organization_id
 *             properties:
 *               order_id:
 *                 type: string
 *               organization_id:
 *                 type: string
 *                 format: uuid
 *               transport_cost:
 *                 type: number
 *                 format: float
 *               warehouse_cost:
 *                 type: number
 *                 format: float
 *               admin_cost:
 *                 type: number
 *                 format: float
 *               return_cost:
 *                 type: number
 *                 format: float
 *               cost_to_serve:
 *                 type: number
 *                 format: float
 *               profit:
 *                 type: number
 *                 format: float
 *               profitable:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Cost result created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, costResultController.create);

/**
 * @swagger
 * /api/cost-results/{id}:
 *   put:
 *     summary: Update cost result
 *     tags: [Cost Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transport_cost:
 *                 type: number
 *                 format: float
 *               warehouse_cost:
 *                 type: number
 *                 format: float
 *               admin_cost:
 *                 type: number
 *                 format: float
 *               return_cost:
 *                 type: number
 *                 format: float
 *               cost_to_serve:
 *                 type: number
 *                 format: float
 *               profit:
 *                 type: number
 *                 format: float
 *               profitable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cost result updated successfully
 *       404:
 *         description: Cost result not found
 */
router.put('/:id', authenticate, costResultController.update);

/**
 * @swagger
 * /api/cost-results/{id}:
 *   delete:
 *     summary: Delete cost result
 *     tags: [Cost Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cost result deleted successfully
 *       404:
 *         description: Cost result not found
 */
router.delete('/:id', authenticate, costResultController.remove);

module.exports = router;
