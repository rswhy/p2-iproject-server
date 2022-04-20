const { User, Food } = require("../models");
const {
  createTokenFromPayload,
  comparePasswordHash,
} = require("../helpers/hashPassword");

class Controller {
  static async register(req, res, next) {
    try {
      const { email, password, gender, age, weight, location } = req.body;

      let user = await User.create({
        email,
        password,
        gender,
        age,
        weight,
        location,
      });

      res.status(201).json({
        statusCode: 201,
        message: `User with email ${email} created successfully`,
        data: {
          email,
          gender,
          age,
          dailyCalories: user.dailyCalories,
        },
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw { name: "Invalid User", statusCode: 401 };
      }

      const userValidation = comparePasswordHash(password, user.password);

      if (!userValidation) {
        throw { name: "Invalid User", statusCode: 401 };
      }

      const payload = {
        id: user.id,
      };

      const accessToken = createTokenFromPayload(payload);

      res.status(200).json({
        statusCode: 200,
        access_token: accessToken,
        data: {
          email: user.email,
          dailyCalories: user.dailyCalories,
          caloriesIntake: user.caloriesIntake,
          status: user.status,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async UserFood(req, res, next) {
    try {
      const { id } = req.user;

      let food = await Food.findAll({
        order: [["id", "ASC"]],
        where: {
          UserId: id,
        },
      });
      
      let user = await User.findByPk(id);

      res.status(200).json({
        statusCode: 200,
        user,
        data: food,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addFood(req, res, next) {
    try {
      const { title, seriesNumber, image, calories } = req.body;
      const { id } = req.user;

      let food = await Food.create({
        title,
        seriesNumber,
        image,
        calories,
        UserId: id,
      });

      let cal = await Food.findAll({
        where: {
          UserId: id,
        },
      });

      let temp = cal.map((el) => {
        return +el.calories;
      });

      let totalCal = temp.reduce(function (a, b) {
        return a + b;
      }, 0);

      let user = await User.findByPk(id);

      if (totalCal >= user.dailyCalories) {
        await User.update(
          {
            caloriesIntake: totalCal.toFixed(2),
            status: "over",
          },
          {
            where: {
              id,
            },
          }
        );
      } else if (totalCal < user.dailyCalories) {
        await User.update(
          {
            caloriesIntake: totalCal.toFixed(2),
            status: "lack",
          },
          {
            where: {
              id,
            },
          }
        );
      }

      res.status(201).json({
        statusCode: 201,
        message: "Food added successfully",
        data: food,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async deleteFood(req, res, next) {
    try {
      const { id } = req.user;

      await Food.destroy({
        where: {
          UserId: id,
        },
      });

      await User.update(
        {
          caloriesIntake: 0,
          status: "lack",
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        statusCode: 200,
        message: "Daily Food reset successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteDetailFood(req, res, next) {
    try {
      const { id } = req.user;
      const {foodId} = req.params

      await Food.destroy({
        where: {
          id: foodId,
        },
      });

      let cal = await Food.findAll({
        where: {
          UserId: id,
        },
      });

      let temp = cal.map((el) => {
        return +el.calories;
      });

      let totalCal = temp.reduce(function (a, b) {
        return a + b;
      }, 0);

      let user = await User.findByPk(id);

      if (totalCal >= user.dailyCalories) {
        await User.update(
          {
            caloriesIntake: totalCal.toFixed(2),
            status: "over",
          },
          {
            where: {
              id,
            },
          }
        );
      } else if (totalCal < user.dailyCalories) {
        await User.update(
          {
            caloriesIntake: totalCal.toFixed(2),
            status: "lack",
          },
          {
            where: {
              id,
            },
          }
        );
      }

      res.status(200).json({
        statusCode: 200,
        message: "Food deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
