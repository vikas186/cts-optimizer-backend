const organizationService = require('../services/organizationService');

const getAll = async (req, res, next) => {
  try {
    const organizations = await organizationService.getAll(req.query);
    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const organization = await organizationService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const organization = await organizationService.create(req.body);
    res.status(201).json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const organization = await organizationService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await organizationService.remove(req.params.id);
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

