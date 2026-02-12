const warehouseCostService = require('../../services/costs/warehouseCostService');

const getAll = async (req, res, next) => {
  try {
    const warehouseCosts = await warehouseCostService.getAll(req.query);
    res.status(200).json({
      success: true,
      count: warehouseCosts.length,
      data: warehouseCosts
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const warehouseCost = await warehouseCostService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: warehouseCost
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const warehouseCost = await warehouseCostService.create(req.body);
    res.status(201).json({
      success: true,
      data: warehouseCost
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const warehouseCost = await warehouseCostService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: warehouseCost
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await warehouseCostService.remove(req.params.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

