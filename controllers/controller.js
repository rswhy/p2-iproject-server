const { User, Food } = require("../models");
const {
  createTokenFromPayload,
  comparePasswordHash,
} = require("../helpers/hashPassword");
const nodemailer = require("nodemailer");
const midtransClient = require("midtrans-client");
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY,
  clientKey: process.env.CLIENT_KEY,
});

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

  static async sendEmail(req, res, next) {
    try {
      const { emailUser, subject, message } = req.body;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "punyacotton57@gmail.com",
          pass: "apkpremium",
        },
      });

      const options = {
        from: emailUser,
        to: "punyacotton57@gmail.com",
        subject: `${subject} (from: ${emailUser})`,
        text: message,
      };

      await transporter.sendMail(options, (err, info) => {
       if (err) {
         console.log(err);
       }
      });

      res.status(200).json({
        statusCode: 200,
        message: `Email has been sent successfully`,
        data: {
          from: emailUser,
          subject,
          message,
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

  static async findUser(req, res, next) {
    try {
      const { id } = req.user;

      let user = await User.findByPk(id);

      res.status(200).json({
        statusCode: 200,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateMembership(req, res, next) {
    try {
      const { id } = req.user;

      let user = await User.update(
        { membership: "premium" },
        {
          where: {
            id,
          },
        }
      );

      user = await User.findByPk(id);

      res.status(200).json({
        statusCode: 200,
        data: user,
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
      const { foodId } = req.params;

      const food = await Food.findByPk(foodId);

      if (!food) {
        throw { name: "Food not found" };
      }

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

      if (totalCal > 0) {
        totalCal = totalCal.toFixed(2);
      }

      if (totalCal >= user.dailyCalories) {
        await User.update(
          {
            caloriesIntake: +totalCal,
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
            caloriesIntake: +totalCal,
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

  static async paymentGateway(req, res, next) {
    try {
      const { email } = req.user;
      let parameter = {
        transaction_details: {
          order_id: "DiETIV" + Math.floor(Math.random() * 10000000 ),
          gross_amount: 10000,
        },
        customer_details: {
          email: email,
          phone: "+6281273081665",
        },
        enabled_payments: [
          "credit_card",
          "cimb_clicks",
          "bca_klikbca",
          "bca_klikpay",
          "bri_epay",
          "echannel",
          "permata_va",
          "bca_va",
          "bni_va",
          "bri_va",
          "other_va",
          "gopay",
          "indomaret",
          "danamon_online",
          "akulaku",
          "shopeepay",
        ],
        credit_card: {
          secure: true,
          channel: "migs",
          bank: "bca",
          installment: {
            required: false,
            terms: {
              bni: [3, 6, 12],
              mandiri: [3, 6, 12],
              cimb: [3],
              bca: [3, 6, 12],
              offline: [6, 12],
            },
          },
          whitelist_bins: ["48111111", "41111111"],
        },
      };
 
      const transaction = await snap.createTransaction(parameter);

      let transactionToken = transaction.token;

      let transactionRedirectUrl = transaction.redirect_url;

      res.status(200).json({
        token: transactionToken,
        redirect_url: transactionRedirectUrl,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
