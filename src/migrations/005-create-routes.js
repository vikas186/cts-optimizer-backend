'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('routes', {
      route_id: {
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
      distance_km: {
        type: Sequelize.FLOAT,
        allowNull: true
      }
    });

    await queryInterface.addIndex('routes', ['organization_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('routes');
  }
};

