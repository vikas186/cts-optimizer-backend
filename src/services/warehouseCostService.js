const { WarehouseCost } = require('../models');

const getAll = async (filters = {}) => {
  return await WarehouseCost.findAll({
    where: filters,
    order: [['effective_from', 'DESC']]
  });
};

const getById = async (id) => {
  const warehouseCost = await WarehouseCost.findByPk(id);
  if (!warehouseCost) {
    throw new Error('Warehouse cost not found');
  }
  return warehouseCost;
};

const create = async (data) => {
  return await WarehouseCost.create(data);
};

const update = async (id, data) => {
  const warehouseCost = await getById(id);
  return await warehouseCost.update(data);
};

const remove = async (id) => {
  const warehouseCost = await getById(id);
  await warehouseCost.destroy();
  return { message: 'Warehouse cost deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

