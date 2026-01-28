const transportCostService = require('../services/transportCostService');

const getAll = async (req, res, next) => {
  try {
    const transportCosts = await transportCostService.getAll(req.query);
    res.status(200).json({
      success: true,
      count: transportCosts.length,
      data: transportCosts
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const transportCost = await transportCostService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: transportCost
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const transportCost = await transportCostService.create(req.body);
    res.status(201).json({
      success: true,
      data: transportCost
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const transportCost = await transportCostService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: transportCost
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await transportCostService.remove(req.params.id);
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

