
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const cors = require("cors");
const { authentication } = require("./middlewares/authentication");
const { errorHandler } = require("./middlewares/error-handlers");
const app = express();

const port = rocess.env.PORT || 3000;

const Controller = require('./controllers/controller')

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.post("/register", Controller.register );

app.post("/login", Controller.login );

app.post("/contactUs", Controller.sendEmail );

app.use(authentication);

app.get("/users", Controller.findUser );

app.patch("/users", Controller.updateMembership );

app.post("/payment", Controller.paymentGateway );

app.get("/food", Controller.UserFood );

app.post("/food", Controller.addFood );

app.delete("/food", Controller.deleteFood );

app.delete("/food/:foodId", Controller.deleteDetailFood );

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});