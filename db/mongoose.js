const mongoose = require("mongoose");
require("dotenv").config();

const password = process.env.MONGO_PASSWORD;
const user = process.env.MONGO_USER;
const dbName = process.env.MONGO_DB;

mongoose.connect(`mongodb+srv://${user}:${password}@jordans.hfi6y.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
