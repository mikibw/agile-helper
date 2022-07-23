module.exports = () => {
  return async (ctx, next) => {
    ctx.success = function (
      data,
      message = "Successfully respond!",
      code = ""
    ) {
      ctx.response.status = 200;
      ctx.body = { code, message, data };
    };
    ctx.failure = function (
      status = 500,
      message = "Something went wrong!",
      code = ""
    ) {
      ctx.response.status = status;
      ctx.response.body = { code, message };
    };
    await next();
  };
};
