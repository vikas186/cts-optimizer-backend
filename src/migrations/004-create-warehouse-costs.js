'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('warehouse_costs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      pick_cost_per_line: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      pack_cost: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      pallet_handling_cost: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      storage_cost_per_day: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      effective_from: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex('warehouse_costs', ['organization_id']);
    await queryInterface.addIndex('warehouse_costs', ['effective_from']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('warehouse_costs');
  }
};

