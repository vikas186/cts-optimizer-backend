const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Get all routes
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of routes
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
 *                     $ref: '#/components/schemas/Route'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, routeController.getAll);

/**
 * @swagger
 * /api/routes/{id}:
 *   get:
 *     summary: Get route by ID
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Route details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Route'
 *       404:
 *         description: Route not found
 */
router.get('/:id', authenticate, routeController.getById);

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Create a new route
 *     tags: [Routes]
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
 *               distance_km:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, routeController.create);

/**
 * @swagger
 * /api/routes/{id}:
 *   put:
 *     summary: Update route
 *     tags: [Routes]
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
 *               distance_km:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Route updated successfully
 *       404:
 *         description: Route not found
 */
router.put('/:id', authenticate, routeController.update);

/**
 * @swagger
 * /api/routes/{id}:
 *   delete:
 *     summary: Delete route
 *     tags: [Routes]
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
 *         description: Route deleted successfully
 *       404:
 *         description: Route not found
 */
router.delete('/:id', authenticate, routeController.remove);

module.exports = router;
