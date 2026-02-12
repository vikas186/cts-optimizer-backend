const costEngineService = require('../../services/costEngine/costEngineService');
const dropSizeService = require('../../services/optimizer/dropSizeService');

const runCostToServe = async (req, res, next) => {
  try {
    const organizationId = req.user?.organization_id;
    if (!organizationId) {
      return res.status(400).json({ success: false, error: 'User organization not set.' });
    }
    const result = await costEngineService.calculateCostToServe(organizationId);
    return res.status(200).json({
      success: true,
      message: `Cost-to-serve calculated for ${result.calculated} orders.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const runDropSize = async (req, res, next) => {
  try {
    const organizationId = req.user?.organization_id;
    if (!organizationId) {
      return res.status(400).json({ success: false, error: 'User organization not set.' });
    }
    const result = await dropSizeService.calculateDropSize(organizationId);
    return res.status(200).json({
      success: true,
      message: `Drop-size recommendations calculated for ${result.calculated} orders.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const runAll = async (req, res, next) => {
  try {
    const organizationId = req.user?.organization_id;
    if (!organizationId) {
      return res.status(400).json({ success: false, error: 'User organization not set.' });
    }
    const costResult = await costEngineService.calculateCostToServe(organizationId);
    const dropResult = await dropSizeService.calculateDropSize(organizationId);
    return res.status(200).json({
      success: true,
      message: 'Cost-to-serve and drop-size calculations completed.',
      data: {
        cost_to_serve: costResult,
        drop_size: dropResult
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  runCostToServe,
  runDropSize,
  runAll
};
