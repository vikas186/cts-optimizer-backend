const exportService = require('../../services/reporting/exportService');

const exportCostResults = async (req, res, next) => {
  try {
    const organizationId = req.user?.organization_id;
    if (!organizationId) {
      return res.status(400).json({ success: false, error: 'User organization not set.' });
    }
    const includeOrderFields = req.query.includeOrder === '1' || req.query.includeOrder === 'true';
    const csv = await exportService.exportCostResultsCsv(organizationId, { includeOrderFields });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="cost-results.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

const exportDropSizeResults = async (req, res, next) => {
  try {
    const organizationId = req.user?.organization_id;
    if (!organizationId) {
      return res.status(400).json({ success: false, error: 'User organization not set.' });
    }
    const csv = await exportService.exportDropSizeResultsCsv(organizationId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="drop-size-results.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

const exportOrdersWithAnalytics = async (req, res, next) => {
  try {
    const organizationId = req.user?.organization_id;
    if (!organizationId) {
      return res.status(400).json({ success: false, error: 'User organization not set.' });
    }
    const csv = await exportService.exportOrdersWithAnalyticsCsv(organizationId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders-with-analytics.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportCostResults,
  exportDropSizeResults,
  exportOrdersWithAnalytics
};
