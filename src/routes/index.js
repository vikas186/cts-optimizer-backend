const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./authRoutes');
const organizationRoutes = require('./organizationRoutes');
const userRoutes = require('./userRoutes');
const customerRoutes = require('./customerRoutes');
const warehouseCostRoutes = require('./warehouseCostRoutes');
const routeRoutes = require('./routeRoutes');
const transportCostRoutes = require('./transportCostRoutes');
const orderRoutes = require('./orderRoutes');
const costResultRoutes = require('./costResultRoutes');
const dropSizeResultRoutes = require('./dropSizeResultRoutes');

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

module.exports = router;

