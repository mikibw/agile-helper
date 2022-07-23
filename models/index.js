const mongoose = require("mongoose");
const { mongodb } = require("../config");

const database = `${mongodb.schema}://${mongodb.host}:${mongodb.port}/${mongodb.database}`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
if (mongodb.username && mongodb.password) {
  options.user = mongodb.username;
  options.pass = mongodb.password;
  options.auth = { authSource: "admin" };
}

// mongoose global configuration
mongoose.set("returnOriginal", false);
mongoose.set("useFindAndModify", false);

// connect
mongoose.connect(database, options, function (error) {
  if (error) {
    console.log(`MongoDB connected failed due to ${error.message}.`);
  } else {
    console.log("MongoDB connected successfully.");
  }
});

// mongod --config /usr/local/etc/mongod.conf --fork
