const userService = require("./user");
const updateModel = require("../models/update");
const dateRange = require("../utils/dateRange");

const findUpdates = async (uid, { date }) => {
  const user = await userService.findUserById(uid);
  if (!user.project) {
    throw Error.http(400, "You are not in any project.");
  }
  const projectId = user.project._id;
  const { start, end } = dateRange(date);
  const updates = await updateModel
    .find({ project: projectId, date: { $gte: start, $lt: end } }, "-project")
    .populate("user", "username avatar")
    .exec();
  return updates.map((update) => update.toObject());
};

const createUpdate = async (uid, { date, comment }) => {
  const user = await userService.findUserById(uid);
  if (!user.project) {
    throw Error.http(400, "You are not in any project.");
  }
  const update = await updateModel.create({
    user: user._id,
    project: user.project._id,
    date,
    comment,
  });
  if (!update) {
    throw Error.http(400, "Create update failed.");
  }
  return update.toObject();
};

const changeUpdate = async (id, { comment }) => {
  const update = await updateModel
    .findOneAndUpdate({ _id: id }, { comment })
    .exec();
  if (!update) {
    throw Error.http(400, "Change update failed.");
  }
  return update.toObject();
};

const deleteUpdate = async (id) => {
  await updateModel.deleteOne({ _id: id }).exec();
};

module.exports = {
  findUpdates,
  createUpdate,
  changeUpdate,
  deleteUpdate,
};
