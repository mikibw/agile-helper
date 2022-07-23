const Koa = require("koa");
const app = new Koa();

const onerror = require("koa-onerror");
const koaBody = require("koa-body");
const json = require("koa-json");
const logger = require("koa-logger");

const static = require("koa-static");
const { resolve } = require("path");

const httpResponse = require("./middlewares/httpResponse");
const errorHandler = require("./middlewares/errorHandler");
const { jwtUtils, jwtAuth } = require("./middlewares/jwt");
const router = require("./routers");

// connect data base
require("./models");

// error handler
onerror(app);

// middlewares
app.use(koaBody());
app.use(json());
app.use(logger());

// static
app.use(static(resolve(__dirname, "resources")));

// middlewares
app.use(httpResponse());
app.use(errorHandler());
app.use(jwtUtils()).use(jwtAuth());

// routes
app.use(router.routes(), router.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
