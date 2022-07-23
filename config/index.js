const dev = require("./config.dev");
const prd = require("./config.prd");

console.log(process.env.NODE_ENV);

module.exports = {
  development: dev,
  production: prd,
}[process.env.NODE_ENV || "development"];
