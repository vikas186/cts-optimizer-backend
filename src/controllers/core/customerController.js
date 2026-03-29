const customerService = require('../../services/core/customerService');

const getAll = async (req, res, next) => {
  try {
    const customers = await customerService.getAll(req.query);
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const customer = await customerService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const customer = await customerService.create(req.body);
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const customer = await customerService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await customerService.remove(req.params.id);
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

