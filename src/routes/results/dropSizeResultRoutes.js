const express = require('express');
const router = express.Router();
const dropSizeResultController = require('../../controllers/results/dropSizeResultController');
const { authenticate } = require('../../middleware/auth/auth');

/**
 * @swagger
 * /api/drop-size-results:
 *   get:
 *     summary: Get all drop size results
 *     description: Retrieve a list of all drop size optimization results
 *     tags: [Drop Size Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of drop size results
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
 *                         $ref: '#/components/schemas/DropSizeResult'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', authenticate, dropSizeResultController.getAll);

/**
 * @swagger
 * /api/drop-size-results/{id}:
 *   get:
 *     summary: Get drop size result by ID
 *     description: Retrieve a specific drop size result by its ID
 *     tags: [Drop Size Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Drop size result UUID
 *     responses:
 *       200:
 *         description: Drop size result details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DropSizeResult'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', authenticate, dropSizeResultController.getById);

// Upload flow only: no manual create/update/delete; results are read-only (GET)

module.exports = router;
