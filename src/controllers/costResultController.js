const costResultService = require('../services/costResultService');

const getAll = async (req, res, next) => {
  try {
    const costResults = await costResultService.getAll(req.query);
    res.status(200).json({
      success: true,
      count: costResults.length,
      data: costResults
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const costResult = await costResultService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: costResult
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const costResult = await costResultService.create(req.body);
    res.status(201).json({
      success: true,
      data: costResult
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const costResult = await costResultService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: costResult
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await costResultService.remove(req.params.id);
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

