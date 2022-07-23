const projectService = require("../services/project");

const filepath = require("../utils/filepath");
const Joi = require("joi");

const findAllProjects = async (ctx, next) => {
  ctx.success(await projectService.findAllProjects());
};

const createProject = async (ctx, next) => {
  const { name, sname, intro } = ctx.request.body;
  try {
    await Joi.object({
      name: Joi.string().required(),
    }).validateAsync({ name });
  } catch (error) {
    return ctx.failure(400, error.message);
  }
  ctx.success(
    await projectService.createProject(ctx.getUserId(), { name, sname, intro })
  );
};

const findProjectAllUsers = async (ctx, next) => {
  const users = await projectService.findProjectAllUsers(ctx.getUserId());
  users.forEach((user) => {
    user.avatar = filepath.remote(ctx.origin, user.avatar);
  });
  ctx.success(users);
};

const findProjectAllTags = async (ctx, next) => {
  const tags = await projectService.findProjectAllTags(ctx.getUserId());
  tags.forEach((tag) => {
    if (tag.roster) {
      tag.roster.avatar = filepath.remote(ctx.origin, tag.roster.avatar);
    }
  });
  ctx.success(tags);
};

module.exports = {
  findAllProjects,
  createProject,
  findProjectAllUsers,
  findProjectAllTags,
};
