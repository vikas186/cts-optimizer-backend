const { Route } = require('../models');

const getAll = async (filters = {}) => {
  return await Route.findAll({
    where: filters
  });
};

const getById = async (routeId) => {
  const route = await Route.findByPk(routeId);
  if (!route) {
    throw new Error('Route not found');
  }
  return route;
};

const create = async (data) => {
  return await Route.create(data);
};

const update = async (routeId, data) => {
  const route = await getById(routeId);
  return await route.update(data);
};

const remove = async (routeId) => {
  const route = await getById(routeId);
  await route.destroy();
  return { message: 'Route deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

