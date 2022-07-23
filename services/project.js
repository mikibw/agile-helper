const projectModel = require("../models/project");
const tagService = require("./tag");
const userService = require("./user");

const findAllProjects = async () => {
  const projects = await projectModel.find().exec();
  return projects.map((project) => project.toObject());
};

const findProjectById = async (id) => {
  const project = await projectModel.findById(id).exec();
  if (!project) {
    throw Error.http(404, `The project '${id}' doesn't exist.`);
  }
  return project.toObject();
};

const createProject = async (uid, { name, sname, intro }) => {
  const user = await userService.findUserById(uid);
  if (user.project) {
    throw Error.http(400, "You are already in a project.");
  }
  const project = await projectModel.create({ name, sname, intro });
  if (!project) {
    throw Error.http(400, "Create project failed.");
  }
  await userService.joinProject(user._id, project._id);
  return project.toObject();
};

const findProjectAllUsers = async (uid) => {
  const user = await userService.findUserById(uid);
  if (!user.project) {
    throw Error.http(400, "You are not in any project.");
  }
  return await userService.findUsersByProjectId(user.project._id);
};

const findProjectAllTags = async (uid) => {
  const user = await userService.findUserById(uid);
  if (!user.project) {
    throw Error.http(400, "You are not in any project.");
  }
  return await tagService.findTagsByProjectId(user.project._id);
};

module.exports = {
  findAllProjects,
  findProjectById,
  createProject,
  findProjectAllUsers,
  findProjectAllTags,
};
