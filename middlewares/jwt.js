const koajwt = require("koa-jwt");
const jsonwebtoken = require("jsonwebtoken");

const secret = "*($@#^$$@&*($";

module.exports = {
  jwtUtils: () => {
    return async (ctx, next) => {
      ctx.genToken = function (userId) {
        return jsonwebtoken.sign({ userId }, secret, { expiresIn: "7d" });
      };
      ctx.getUserId = function () {
        return ctx.state.user.userId;
      };
      await next();
    };
  },
  jwtAuth: () => {
    return koajwt({ secret }).unless({
      path: [
        /^\/upload/,
        /^\/v1\/users\/login/,
        /^\/v1\/users\/register/,
        /^\/v1\/users\/join/,
      ],
    });
  },
};
