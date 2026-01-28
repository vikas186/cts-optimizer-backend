'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      order_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      customer_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'customer_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      route_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'routes',
          key: 'route_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      revenue: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      weight_kg: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      volume_m3: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      lines: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      pallets: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      order_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    });

    await queryInterface.addIndex('orders', ['organization_id']);
    await queryInterface.addIndex('orders', ['customer_id']);
    await queryInterface.addIndex('orders', ['route_id']);
    await queryInterface.addIndex('orders', ['order_date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};

