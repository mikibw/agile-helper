Error.http = function (status, message, code) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      console.log(error);
      ctx.failure(error.status, error.message, error.code);
    }
  };
};
