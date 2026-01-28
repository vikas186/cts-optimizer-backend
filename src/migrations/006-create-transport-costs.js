'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transport_costs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
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
      base_cost: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      cost_per_kg: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      cost_per_km: {
        type: Sequelize.FLOAT,
        allowNull: true
      }
    });

    await queryInterface.addIndex('transport_costs', ['route_id']);
    await queryInterface.addIndex('transport_costs', ['organization_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transport_costs');
  }
};

