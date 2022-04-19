const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET;

const createHashFromPassword = (password) => {
  return bcrypt.hashSync(password, 8);
};

const comparePasswordHash = (passwordInput, hashDatabase) => {
  return bcrypt.compareSync(passwordInput, hashDatabase);
};

const createTokenFromPayload = (payload) => {
  return jwt.sign(payload, secretKey);
};

const readPayloadFromToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = {
  createHashFromPassword,
  comparePasswordHash,
  createTokenFromPayload,
  readPayloadFromToken,
};
