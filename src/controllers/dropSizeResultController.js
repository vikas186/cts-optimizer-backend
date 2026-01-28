const dropSizeResultService = require('../services/dropSizeResultService');

const getAll = async (req, res, next) => {
  try {
    const dropSizeResults = await dropSizeResultService.getAll(req.query);
    res.status(200).json({
      success: true,
      count: dropSizeResults.length,
      data: dropSizeResults
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const dropSizeResult = await dropSizeResultService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: dropSizeResult
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const dropSizeResult = await dropSizeResultService.create(req.body);
    res.status(201).json({
      success: true,
      data: dropSizeResult
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const dropSizeResult = await dropSizeResultService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: dropSizeResult
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await dropSizeResultService.remove(req.params.id);
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

