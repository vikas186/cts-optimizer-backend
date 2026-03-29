const express = require('express');
const router = express.Router();
const costResultController = require('../../controllers/results/costResultController');
const { authenticate } = require('../../middleware/auth/auth');

/**
 * @swagger
 * /api/cost-results:
 *   get:
 *     summary: Get all cost results
 *     description: Retrieve a list of all cost calculation results
 *     tags: [Cost Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cost results
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
 *                         $ref: '#/components/schemas/CostResult'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', authenticate, costResultController.getAll);

/**
 * @swagger
 * /api/cost-results/{id}:
 *   get:
 *     summary: Get cost result by ID
 *     description: Retrieve a specific cost result by its ID
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
 *         description: Cost result UUID
 *     responses:
 *       200:
 *         description: Cost result details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CostResult'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', authenticate, costResultController.getById);

// Upload flow only: no manual create/update/delete; results are read-only (GET)

module.exports = router;
