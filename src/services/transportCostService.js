const { TransportCost } = require('../models');

const getAll = async (filters = {}) => {
  return await TransportCost.findAll({
    where: filters
  });
};

const getById = async (id) => {
  const transportCost = await TransportCost.findByPk(id);
  if (!transportCost) {
    throw new Error('Transport cost not found');
  }
  return transportCost;
};

const create = async (data) => {
  return await TransportCost.create(data);
};

const update = async (id, data) => {
  const transportCost = await getById(id);
  return await transportCost.update(data);
};

const remove = async (id) => {
  const transportCost = await getById(id);
  await transportCost.destroy();
  return { message: 'Transport cost deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

