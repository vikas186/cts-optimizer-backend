const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth/authRoutes');
const organizationRoutes = require('./auth/organizationRoutes');
const userRoutes = require('./auth/userRoutes');
const customerRoutes = require('./core/customerRoutes');
const routeRoutes = require('./core/routeRoutes');
const warehouseCostRoutes = require('./costs/warehouseCostRoutes');
const transportCostRoutes = require('./costs/transportCostRoutes');
const orderRoutes = require('./orders/orderRoutes');
const costResultRoutes = require('./results/costResultRoutes');
const dropSizeResultRoutes = require('./results/dropSizeResultRoutes');
const uploadRoutes = require('./upload/uploadRoutes');
const calculateRoutes = require('./calculate/calculateRoutes');
const exportRoutes = require('./reporting/exportRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/organizations', organizationRoutes);
router.use('/users', userRoutes);
router.use('/customers', customerRoutes);
router.use('/warehouse-costs', warehouseCostRoutes);
router.use('/routes', routeRoutes);
router.use('/transport-costs', transportCostRoutes);
router.use('/orders', orderRoutes);
router.use('/cost-results', costResultRoutes);
router.use('/drop-size-results', dropSizeResultRoutes);
router.use('/upload', uploadRoutes);
router.use('/calculate', calculateRoutes);
router.use('/export', exportRoutes);

module.exports = router;

