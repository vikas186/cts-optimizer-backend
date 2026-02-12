const { Order } = require('../../models');

const getAll = async (filters = {}) => {
  return await Order.findAll({
    where: filters,
    order: [['order_date', 'DESC']]
  });
};

const getById = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

const create = async (data) => {
  return await Order.create(data);
};

const update = async (orderId, data) => {
  const order = await getById(orderId);
  return await order.update(data);
};

const remove = async (orderId) => {
  const order = await getById(orderId);
  await order.destroy();
  return { message: 'Order deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

