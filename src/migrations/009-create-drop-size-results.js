'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('drop_size_results', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'order_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      fixed_cost: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      unit_variable_cost: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      unit_revenue: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      min_profitable_quantity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      calculated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('drop_size_results', ['order_id']);
    await queryInterface.addIndex('drop_size_results', ['organization_id']);
    await queryInterface.addIndex('drop_size_results', ['calculated_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('drop_size_results');
  }
};

