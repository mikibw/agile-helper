const userService = require("../services/user");

const filepath = require("../utils/filepath");
const Joi = require("joi");

const findUserById = async (ctx, next) => {
  const uid = ctx.request.query.id || ctx.getUserId();
  const user = await userService.findUserById(uid);
  user.avatar = filepath.remote(ctx.origin, user.avatar);
  ctx.success(user);
};

const changeAvatar = async (ctx, next) => {
  const [uid, { file }] = [ctx.getUserId(), ctx.request.files];
  try {
    await Joi.object({
      file: Joi.required(),
    }).validateAsync({ file });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  const avatar = await userService.changeAvatar(uid, file);
  ctx.success({ avatar: filepath.remote(ctx.origin, avatar) });
};

const joinProject = async (ctx, next) => {
  const { projectId } = ctx.request.body;
  try {
    await Joi.object({
      projectId: Joi.string().required(),
    }).validateAsync({ projectId });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  await userService.joinProject(ctx.getUserId(), projectId);
  ctx.success({ success: true });
};

const exitProject = async (ctx, next) => {
  const { userId = ctx.getUserId() } = ctx.request.body;
  await userService.exitProject(userId);
  ctx.success({ success: true });
};

const loginByCredentials = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  try {
    await Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
    }).validateAsync({ username, password });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  const user = await userService.loginByCredentials(username, password);
  user.token = ctx.genToken(user._id);
  user.avatar = filepath.remote(ctx.origin, user.avatar);
  ctx.success(user);
};

const registerByCredentials = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  try {
    await Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
    }).validateAsync({ username, password });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  const user = await userService.registerByCredentials(username, password);
  user.avatar = filepath.remote(ctx.origin, user.avatar);
  ctx.success(user);
};

const joinByCredentials = async (ctx, next) => {
  const { username, password, code, autoJoin } = ctx.request.body;
  try {
    await Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
      code: Joi.string().required(),
      autoJoin: Joi.bool().required(),
    }).validateAsync({ username, password, code, autoJoin });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  return ctx.success(
    { success: true },
    await userService.joinByCredentials(username, password, code, autoJoin)
  );
};

module.exports = {
  findUserById,
  changeAvatar,
  joinProject,
  exitProject,
  loginByCredentials,
  registerByCredentials,
  joinByCredentials,
};
