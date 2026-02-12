const express = require('express');
const router = express.Router();
const dropSizeResultController = require('../../controllers/results/dropSizeResultController');
const { authenticate } = require('../../middleware/auth/auth');

/**
 * @swagger
 * /api/drop-size-results:
 *   get:
 *     summary: Get all drop size results
 *     tags: [Drop Size Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of drop size results
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
 *                     $ref: '#/components/schemas/DropSizeResult'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, dropSizeResultController.getAll);

/**
 * @swagger
 * /api/drop-size-results/{id}:
 *   get:
 *     summary: Get drop size result by ID
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
 *     responses:
 *       200:
 *         description: Drop size result details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DropSizeResult'
 *       404:
 *         description: Drop size result not found
 */
router.get('/:id', authenticate, dropSizeResultController.getById);

/**
 * @swagger
 * /api/drop-size-results:
 *   post:
 *     summary: Create a new drop size result
 *     tags: [Drop Size Results]
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
 *               fixed_cost:
 *                 type: number
 *                 format: float
 *               unit_variable_cost:
 *                 type: number
 *                 format: float
 *               unit_revenue:
 *                 type: number
 *                 format: float
 *               min_profitable_quantity:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Drop size result created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, dropSizeResultController.create);

/**
 * @swagger
 * /api/drop-size-results/{id}:
 *   put:
 *     summary: Update drop size result
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fixed_cost:
 *                 type: number
 *                 format: float
 *               unit_variable_cost:
 *                 type: number
 *                 format: float
 *               unit_revenue:
 *                 type: number
 *                 format: float
 *               min_profitable_quantity:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Drop size result updated successfully
 *       404:
 *         description: Drop size result not found
 */
router.put('/:id', authenticate, dropSizeResultController.update);

/**
 * @swagger
 * /api/drop-size-results/{id}:
 *   delete:
 *     summary: Delete drop size result
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
 *     responses:
 *       200:
 *         description: Drop size result deleted successfully
 *       404:
 *         description: Drop size result not found
 */
router.delete('/:id', authenticate, dropSizeResultController.remove);

module.exports = router;
