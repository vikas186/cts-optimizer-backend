const express = require('express');
const router = express.Router();
const transportCostController = require('../../controllers/costs/transportCostController');
const { authenticate } = require('../../middleware/auth/auth');

/**
 * @swagger
 * /api/transport-costs:
 *   get:
 *     summary: Get all transport costs
 *     description: Retrieve a list of all transport costs
 *     tags: [Transport Costs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transport costs
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
 *                         $ref: '#/components/schemas/TransportCost'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', authenticate, transportCostController.getAll);

/**
 * @swagger
 * /api/transport-costs/{id}:
 *   get:
 *     summary: Get transport cost by ID
 *     description: Retrieve a specific transport cost by its ID
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
 *         description: Transport cost UUID
 *     responses:
 *       200:
 *         description: Transport cost details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TransportCost'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', authenticate, transportCostController.getById);

// XL-only flow: create/update/delete only via POST /api/upload/excel

module.exports = router;
