"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "membership", {
      type: Sequelize.STRING,
      defaultValue: "regular",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "membership", {});
  },
};
