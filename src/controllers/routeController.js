const routeService = require('../services/routeService');

const getAll = async (req, res, next) => {
  try {
    const routes = await routeService.getAll(req.query);
    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const route = await routeService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const route = await routeService.create(req.body);
    res.status(201).json({
      success: true,
      data: route
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const route = await routeService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await routeService.remove(req.params.id);
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

