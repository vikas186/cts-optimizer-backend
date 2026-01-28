const { CostResult } = require('../models');

const getAll = async (filters = {}) => {
  return await CostResult.findAll({
    where: filters,
    order: [['calculated_at', 'DESC']]
  });
};

const getById = async (id) => {
  const costResult = await CostResult.findByPk(id);
  if (!costResult) {
    throw new Error('Cost result not found');
  }
  return costResult;
};

const create = async (data) => {
  return await CostResult.create(data);
};

const update = async (id, data) => {
  const costResult = await getById(id);
  return await costResult.update(data);
};

const remove = async (id) => {
  const costResult = await getById(id);
  await costResult.destroy();
  return { message: 'Cost result deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

