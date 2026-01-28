const express = require('express');
const router = express.Router();
const transportCostController = require('../controllers/transportCostController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/transport-costs:
 *   get:
 *     summary: Get all transport costs
 *     tags: [Transport Costs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transport costs
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
 *                     $ref: '#/components/schemas/TransportCost'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, transportCostController.getAll);

/**
 * @swagger
 * /api/transport-costs/{id}:
 *   get:
 *     summary: Get transport cost by ID
 *     tags: [Transport Costs]
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
 *         description: Transport cost details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TransportCost'
 *       404:
 *         description: Transport cost not found
 */
router.get('/:id', authenticate, transportCostController.getById);

/**
 * @swagger
 * /api/transport-costs:
 *   post:
 *     summary: Create a new transport cost
 *     tags: [Transport Costs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - route_id
 *               - organization_id
 *             properties:
 *               route_id:
 *                 type: string
 *               organization_id:
 *                 type: string
 *                 format: uuid
 *               base_cost:
 *                 type: number
 *                 format: float
 *               cost_per_kg:
 *                 type: number
 *                 format: float
 *               cost_per_km:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Transport cost created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, transportCostController.create);

/**
 * @swagger
 * /api/transport-costs/{id}:
 *   put:
 *     summary: Update transport cost
 *     tags: [Transport Costs]
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
 *               base_cost:
 *                 type: number
 *                 format: float
 *               cost_per_kg:
 *                 type: number
 *                 format: float
 *               cost_per_km:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Transport cost updated successfully
 *       404:
 *         description: Transport cost not found
 */
router.put('/:id', authenticate, transportCostController.update);

/**
 * @swagger
 * /api/transport-costs/{id}:
 *   delete:
 *     summary: Delete transport cost
 *     tags: [Transport Costs]
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
 *         description: Transport cost deleted successfully
 *       404:
 *         description: Transport cost not found
 */
router.delete('/:id', authenticate, transportCostController.remove);

module.exports = router;
