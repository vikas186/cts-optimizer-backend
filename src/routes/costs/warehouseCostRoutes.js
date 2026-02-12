const express = require('express');
const router = express.Router();
const warehouseCostController = require('../../controllers/costs/warehouseCostController');
const { authenticate } = require('../../middleware/auth/auth');

/**
 * @swagger
 * /api/warehouse-costs:
 *   get:
 *     summary: Get all warehouse costs
 *     description: Retrieve a list of all warehouse costs
 *     tags: [Warehouse Costs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of warehouse costs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessListResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WarehouseCost'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', authenticate, warehouseCostController.getAll);

/**
 * @swagger
 * /api/warehouse-costs/{id}:
 *   get:
 *     summary: Get warehouse cost by ID
 *     description: Retrieve a specific warehouse cost by its ID
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
 *         description: Warehouse cost UUID
 *     responses:
 *       200:
 *         description: Warehouse cost details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/WarehouseCost'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', authenticate, warehouseCostController.getById);

// XL-only flow: create/update/delete only via POST /api/upload/excel

module.exports = router;
