
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/error-handlers");
const app = express();

const port = 3000;

const Controller = require('./controllers/controller')

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/login", Controller.login);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});