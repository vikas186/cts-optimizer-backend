const express = require('express');
const router = express.Router();
const warehouseCostController = require('../controllers/warehouseCostController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/warehouse-costs:
 *   get:
 *     summary: Get all warehouse costs
 *     tags: [Warehouse Costs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of warehouse costs
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
 *                     $ref: '#/components/schemas/WarehouseCost'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, warehouseCostController.getAll);

/**
 * @swagger
 * /api/warehouse-costs/{id}:
 *   get:
 *     summary: Get warehouse cost by ID
 *     tags: [Warehouse Costs]
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
 *         description: Warehouse cost details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/WarehouseCost'
 *       404:
 *         description: Warehouse cost not found
 */
router.get('/:id', authenticate, warehouseCostController.getById);

/**
 * @swagger
 * /api/warehouse-costs:
 *   post:
 *     summary: Create a new warehouse cost
 *     tags: [Warehouse Costs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organization_id
 *             properties:
 *               organization_id:
 *                 type: string
 *                 format: uuid
 *               pick_cost_per_line:
 *                 type: number
 *                 format: float
 *               pack_cost:
 *                 type: number
 *                 format: float
 *               pallet_handling_cost:
 *                 type: number
 *                 format: float
 *               storage_cost_per_day:
 *                 type: number
 *                 format: float
 *               effective_from:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Warehouse cost created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, warehouseCostController.create);

/**
 * @swagger
 * /api/warehouse-costs/{id}:
 *   put:
 *     summary: Update warehouse cost
 *     tags: [Warehouse Costs]
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
 *               pick_cost_per_line:
 *                 type: number
 *                 format: float
 *               pack_cost:
 *                 type: number
 *                 format: float
 *               pallet_handling_cost:
 *                 type: number
 *                 format: float
 *               storage_cost_per_day:
 *                 type: number
 *                 format: float
 *               effective_from:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Warehouse cost updated successfully
 *       404:
 *         description: Warehouse cost not found
 */
router.put('/:id', authenticate, warehouseCostController.update);

/**
 * @swagger
 * /api/warehouse-costs/{id}:
 *   delete:
 *     summary: Delete warehouse cost
 *     tags: [Warehouse Costs]
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
 *         description: Warehouse cost deleted successfully
 *       404:
 *         description: Warehouse cost not found
 */
router.delete('/:id', authenticate, warehouseCostController.remove);

module.exports = router;
