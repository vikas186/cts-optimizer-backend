const bcrypt = require('bcryptjs');
const { User } = require('../../models');

const getAll = async (filters = {}) => {
  return await User.findAll({
    where: filters,
    attributes: { exclude: ['password'] }
  });
};

const getById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const create = async (data) => {
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }
  const user = await User.create(data);
  const userResponse = user.toJSON();
  delete userResponse.password;
  return userResponse;
};

const update = async (id, data) => {
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }
  const user = await getById(id);
  await User.update(data, { where: { id } });
  return await getById(id);
};

const remove = async (id) => {
  const user = await getById(id);
  await user.destroy();
  return { message: 'User deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

