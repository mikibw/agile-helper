const updateService = require("../services/update");
const filepath = require("../utils/filepath");
const Joi = require("joi");

const findUpdates = async (ctx, next) => {
  const { date } = ctx.request.query;
  try {
    await Joi.object({
      date: Joi.date().required(),
    }).validateAsync({ date });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  const updates = await updateService.findUpdates(ctx.getUserId(), { date });
  updates.forEach((update) => {
    update.user.avatar = filepath.remote(ctx.origin, update.user.avatar);
  });
  ctx.success(updates);
};

const createUpdate = async (ctx, next) => {
  const { date, comment } = ctx.request.body;
  try {
    await Joi.object({
      date: Joi.date().required(),
      comment: Joi.string().required(),
    }).validateAsync({ date, comment });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  await updateService.createUpdate(ctx.getUserId(), { date, comment });
  ctx.success({ success: true });
};

const changeUpdate = async (ctx, next) => {
  const { comment } = ctx.request.body;
  try {
    await Joi.object({
      comment: Joi.string().required(),
    }).validateAsync({ comment });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  await updateService.changeUpdate(ctx.params.id, { comment });
  ctx.success({ success: true });
};

const deleteUpdate = async (ctx, next) => {
  await updateService.deleteUpdate(ctx.params.id);
  ctx.success({ success: true });
};

module.exports = {
  findUpdates,
  createUpdate,
  changeUpdate,
  deleteUpdate,
};
