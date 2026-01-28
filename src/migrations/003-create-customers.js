'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customers', {
      customer_id: {
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
      segment: {
        type: Sequelize.STRING,
        allowNull: true
      },
      revenue_per_unit: {
        type: Sequelize.FLOAT,
        allowNull: true
      }
    });

    await queryInterface.addIndex('customers', ['organization_id']);
    await queryInterface.addIndex('customers', ['segment']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customers');
  }
};

