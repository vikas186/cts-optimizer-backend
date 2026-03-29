const { Organization } = require('../../models');

const getAll = async (filters = {}) => {
  return await Organization.findAll({
    where: filters
  });
};

const getById = async (id) => {
  const organization = await Organization.findByPk(id);
  if (!organization) {
    throw new Error('Organization not found');
  }
  return organization;
};

const create = async (data) => {
  return await Organization.create(data);
};

const update = async (id, data) => {
  const organization = await getById(id);
  return await organization.update(data);
};

const remove = async (id) => {
  const organization = await getById(id);
  await organization.destroy();
  return { message: 'Organization deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

