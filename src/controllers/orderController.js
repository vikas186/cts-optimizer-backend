const orderService = require('../services/orderService');

const getAll = async (req, res, next) => {
  try {
    const orders = await orderService.getAll(req.query);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const order = await orderService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const order = await orderService.create(req.body);
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const order = await orderService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await orderService.remove(req.params.id);
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

