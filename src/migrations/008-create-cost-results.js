'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cost_results', {
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
      transport_cost: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      warehouse_cost: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      admin_cost: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      return_cost: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      cost_to_serve: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      profit: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      profitable: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      calculated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('cost_results', ['order_id']);
    await queryInterface.addIndex('cost_results', ['organization_id']);
    await queryInterface.addIndex('cost_results', ['calculated_at']);
    await queryInterface.addIndex('cost_results', ['profitable']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cost_results');
  }
};

