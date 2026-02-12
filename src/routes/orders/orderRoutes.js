const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orders/orderController');
const { authenticate } = require('../../middleware/auth/auth');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
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
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, orderController.getAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get('/:id', authenticate, orderController.getById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
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
 *               - customer_id
 *               - route_id
 *             properties:
 *               order_id:
 *                 type: string
 *               organization_id:
 *                 type: string
 *                 format: uuid
 *               customer_id:
 *                 type: string
 *               route_id:
 *                 type: string
 *               sku:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               revenue:
 *                 type: number
 *                 format: float
 *               weight_kg:
 *                 type: number
 *                 format: float
 *               volume_m3:
 *                 type: number
 *                 format: float
 *               lines:
 *                 type: integer
 *               pallets:
 *                 type: integer
 *               order_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, orderController.create);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               revenue:
 *                 type: number
 *                 format: float
 *               weight_kg:
 *                 type: number
 *                 format: float
 *               volume_m3:
 *                 type: number
 *                 format: float
 *               lines:
 *                 type: integer
 *               pallets:
 *                 type: integer
 *               order_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */
router.put('/:id', authenticate, orderController.update);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete('/:id', authenticate, orderController.remove);

module.exports = router;
