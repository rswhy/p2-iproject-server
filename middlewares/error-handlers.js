const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "JsonWebTokenError":
      res.status(401).json({
        name: 'JsonWebTokenError',
        message: "Invalid Token, please login first",
      });
      break;
    case "TokenExpiredError":
      res.status(401).json({
        message: "Invalid Token, please login first",
      });
      break;
    case "Unauthorized":
      res.status(401).json({
        name: 'JsonWebTokenError',
        message: "Invalid Token, please login first",
      });
      break;
    case "Food not found" :
      res.status(404).json({
        statusCode: 404,
        error: {
          message: "Food not found" ,
        },
      });
      break;
    case "Invalid User":
      res.status(401).json({
        statusCode: 401,
        error: {
          message: "Invalid email or password",
        },
      });
      break;
    case "Invalid Email":
      res.status(401).json({
        statusCode: 401,
        error: {
          message: "Invalid email or password",
        },
      });
      break;
    case "Invalid Password":
      res.status(401).json({
        statusCode: 401,
        error: {
          message: "Invalid email or password",
        },
      });
      break;
    case "Forbidden":
      res.status(403).json({
        statusCode: 403,
        error: {
          message: "You don't have permission to do this action",
        },
      });
      break;
    case "SequelizeUniqueConstraintError":
      const errorConstraints = err.errors.map((el) => el.message);

      res.status(400).json({
        statusCode: 400,
        error: {
          message: errorConstraints,
        },
      });
      break;
    case "SequelizeValidationError":
      const errorValidations = err.errors.map((el) => el.message);

      res.status(400).json({
        statusCode: 400,
        error: {
          message: errorValidations,
        },
      });
      break;
    default:
      res.status(500).json({
        statusCode: 500,
        error: {
          message: "Internal Server Error",
        },
      });
  }
};

module.exports = { errorHandler };
