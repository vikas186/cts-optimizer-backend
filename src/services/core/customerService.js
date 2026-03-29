const { Customer } = require('../../models');

const getAll = async (filters = {}) => {
  return await Customer.findAll({
    where: filters
  });
};

const getById = async (customerId) => {
  const customer = await Customer.findByPk(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }
  return customer;
};

const create = async (data) => {
  return await Customer.create(data);
};

const update = async (customerId, data) => {
  const customer = await getById(customerId);
  return await customer.update(data);
};

const remove = async (customerId) => {
  const customer = await getById(customerId);
  await customer.destroy();
  return { message: 'Customer deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

