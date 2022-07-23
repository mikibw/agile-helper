const tagService = require("../services/tag");

const filepath = require("../utils/filepath");
const Joi = require("joi");

const findTagById = async (ctx, next) => {
  const tag = await tagService.findTagById(ctx.params.id);
  tag.roster.avatar = filepath.remote(ctx.origin, tag.roster.avatar);
  ctx.success(tag);
};

const createTag = async (ctx, next) => {
  const { name } = ctx.request.body;
  try {
    await Joi.object({
      name: Joi.string().required(),
    }).validateAsync({ name });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  ctx.success(await tagService.createTag(ctx.getUserId(), { name }));
};

const changeName = async (ctx, next) => {
  const { name } = ctx.request.body;
  try {
    await Joi.object({
      name: Joi.string().required(),
    }).validateAsync({ name });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  const tag = await tagService.changeName(ctx.params.id, ctx.getUserId(), name);
  if (tag.roster) {
    tag.roster.avatar = filepath.remote(ctx.origin, tag.roster.avatar);
  }
  ctx.success(tag);
};

const changeRoster = async (ctx, next) => {
  const { rosterId } = ctx.request.body;
  try {
    await Joi.object({
      rosterId: Joi.string().required(),
    }).validateAsync({ rosterId });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  const tag = await tagService.changeRoster(
    ctx.params.id,
    ctx.getUserId(),
    rosterId
  );
  if (tag.roster) {
    tag.roster.avatar = filepath.remote(ctx.origin, tag.roster.avatar);
  }
  ctx.success(tag);
};

const deleteTag = async (ctx, next) => {
  await tagService.deleteTag(ctx.params.id, ctx.getUserId());
  ctx.success({ success: true });
};

module.exports = {
  findTagById,
  createTag,
  changeName,
  changeRoster,
  deleteTag,
};
