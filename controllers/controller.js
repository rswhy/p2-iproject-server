const { User } = require("../models");
const {
  createTokenFromPayload,
  comparePasswordHash,
} = require("../helpers/hashPassword");

class Controller {
  static async register(req, res, next) {
    try {
      const { email, password, gender, age, weight, location } = req.body;

      let user = await User.create({
        email, password, gender, age, weight, location 
      });

      res.status(201).json({
        statusCode: 201,
        message: `User with email ${email} created successfully`,
        data: {
          email,
          gender, 
          age,
          dailyCalories: user.dailyCalories
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
          email
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
          status: user.status
        },
      });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = Controller;
