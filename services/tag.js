const tagModel = require("../models/tag");
const userService = require("../services/user");

const findTagById = async (id) => {
  const tag = await tagModel
    .findOne({ _id: id })
    .populate("project")
    .populate("roster", "username avatar")
    .exec();
  if (!tag) {
    throw Error.http(404, `Tag '${id}' doesn't exist.`);
  }
  return tag.toObject();
};

const findTagsByProjectId = async (projectId) => {
  const tags = await tagModel
    .find({ project: projectId }, "-project")
    .populate("roster", "username avatar")
    .exec();
  return tags.map((tag) => tag.toObject());
};

const createTag = async (uid, { name }) => {
  const user = await userService.findUserById(uid);
  if (!user.project) {
    throw Error.http(400, "You are not in any project.");
  }
  const tag = await tagModel.create({ name, project: user.project._id });
  if (!tag) {
    throw Error.http(400, "Create tag failed.");
  }
  return tag.toObject();
};

const changeName = async (id, uid, name) => {
  let tag = await tagModel.findOne({ _id: id }).populate("project").exec();
  if (!tag) {
    throw Error.http(404, `Tag '${id}' does not exist.`);
  }
  tag = tag.toObject();

  const user = await userService.findUserById(uid);
  if (`${user.project._id}` !== `${tag.project._id}`) {
    throw Error.http(403, "No access to change tag name.");
  }

  tag = await tagModel
    .findOneAndUpdate({ _id: id }, { name })
    .populate("roster", "username avatar")
    .exec();
  if (!tag) {
    throw Error.http(400, "Change tag name failed.");
  }
  return tag.toObject();
};

const changeRoster = async (id, uid, rosterId) => {
  let tag = await tagModel.findOne({ _id: id }).populate("project").exec();
  if (!tag) {
    throw Error.http(404, `Tag '${id}' does not exist.`);
  }
  tag = tag.toObject();

  const user = await userService.findUserById(uid);
  if (`${user.project._id}` !== `${tag.project._id}`) {
    throw Error.http(403, "No access to change roster.");
  }

  const roster = await userService.findUserById(rosterId);
  if (`${roster.project._id}` !== `${tag.project._id}`) {
    throw Error.http(400, "The roster is not in corresponding project.");
  }

  tag = await tagModel
    .findOneAndUpdate({ _id: id }, { roster: roster._id })
    .populate("roster", "username avatar")
    .exec();
  if (!tag) {
    throw Error.http(400, "Change roster failed.");
  }
  return tag.toObject();
};

const deleteTag = async (id, uid) => {
  let tag = await tagModel.findOne({ _id: id }).populate("project").exec();
  if (!tag) {
    throw Error.http(404, `Tag '${id}' does not exist.`);
  }
  tag = tag.toObject();

  const user = await userService.findUserById(uid);
  if (`${user.project._id}` !== `${tag.project._id}`) {
    throw Error.http(403, "No access to delete tag.");
  }

  await tagModel.deleteOne({ _id: id }).exec();
};

module.exports = {
  findTagById,
  findTagsByProjectId,
  createTag,
  changeName,
  changeRoster,
  deleteTag,
};
