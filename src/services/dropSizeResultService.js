const { DropSizeResult } = require('../models');

const getAll = async (filters = {}) => {
  return await DropSizeResult.findAll({
    where: filters,
    order: [['calculated_at', 'DESC']]
  });
};

const getById = async (id) => {
  const dropSizeResult = await DropSizeResult.findByPk(id);
  if (!dropSizeResult) {
    throw new Error('Drop size result not found');
  }
  return dropSizeResult;
};

const create = async (data) => {
  return await DropSizeResult.create(data);
};

const update = async (id, data) => {
  const dropSizeResult = await getById(id);
  return await dropSizeResult.update(data);
};

const remove = async (id) => {
  const dropSizeResult = await getById(id);
  await dropSizeResult.destroy();
  return { message: 'Drop size result deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

