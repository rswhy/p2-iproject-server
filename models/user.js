"use strict";
const { createHashFromPassword } = require("../helpers/hashPassword");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Food, { foreignKey: 'UserId'})
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email has been registered" },
        validate: {
          notEmpty: { msg: "Email is required" },
          notNull: { msg: "Email is required" },
          isEmail: { msg: "Email format is invalid" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password is required" },
          notNull: { msg: "Password is required" },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Gender is required" },
          notNull: { msg: "Gender is required" },
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Age is required" },
          notNull: { msg: "Age is required" },
          min: { args: 18, msg: "Age minimum shall be 18" },
        },
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Weight is required" },
          notNull: { msg: "Weight is required" },
          min: { args: 10, msg: "Weight minimum shall be 10" },
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Location is required" },
          notNull: { msg: "Location is required" },
        },
      },
      dailyCalories: DataTypes.INTEGER,
      caloriesIntake: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "lack",
      },
    },
    {
      sequelize,
      hooks: {
        beforeCreate(instance, options) {
          let hash = createHashFromPassword(instance.password);
          instance.password = hash;

          if (instance.gender === "male") {
            instance.dailyCalories = 15.3 * instance.weight + 679;
          } else if (instance.gender === "female") {
            instance.dailyCalories = 14.7 * instance.weight + 496;
          }
        },
      },
      modelName: "User",
    }
  );
  return User;
};
