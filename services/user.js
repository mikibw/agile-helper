const userModel = require("../models/user");
const projectService = require("./project");
const invitationService = require("./invitation");

const filepath = require("../utils/filepath");
const stringGenerate = require("../utils/stringGenerate");
const fs = require("fs");

const findUserById = async (uid) => {
  const user = await userModel
    .findOne({ _id: uid }, "-password")
    .populate("project")
    .exec();
  if (!user) {
    throw Error.http(400, `The user '${uid}' doesn't exist.`);
  }
  return user.toObject();
};

const findUsersByProjectId = async (projectId) => {
  const users = await userModel
    .find({ project: projectId }, "-password")
    .exec();
  return users.map((user) => user.toObject());
};

const changeAvatar = async (uid, file) => {
  const ext = file.name.split(".").pop();
  if (ext != "jpg" && ext != "png") {
    throw Error.http(400, "Just '.jpg' or '.png' supported.");
  }

  const filename = `${stringGenerate(36)}.${ext}`;
  const dir = filepath.local();
  fs.existsSync(dir) || fs.mkdirSync(dir, { recursive: true });

  const reader = fs.createReadStream(file.path);
  const stream = fs.createWriteStream(filepath.local(filename));
  reader.pipe(stream);

  const user = await userModel
    .findOneAndUpdate({ _id: uid }, { avatar: filename })
    .exec();
  if (!user) {
    throw Error.http(400, "Change avatar failed.");
  }
  return await findUserById(user._id);
};

const joinProject = async (uid, projectId) => {
  let user = await findUserById(uid);
  if (user.project) {
    throw Error.http(400, "You are already in a project, please exit firstly.");
  }
  const project = await projectService.findProjectById(projectId);
  user = await userModel
    .findOneAndUpdate({ _id: user._id }, { project: project._id })
    .exec();
  if (!user) {
    throw Error.http(400, "Join project failed.");
  }
  return await findUserById(user._id);
};

const exitProject = async (uid) => {
  let user = await findUserById(uid);
  if (!user.project) {
    throw Error.http(400, "The user is not in any project.");
  }
  user = await userModel
    .findOneAndUpdate({ _id: user._id }, { project: null })
    .exec();
  if (!user) {
    throw Error.http(400, "Exit project failed.");
  }
  return await findUserById(user._id);
};

const loginByCredentials = async (username, password) => {
  const user = await userModel.findOne({ username, password }).exec();
  if (!user) {
    throw Error.http(400, "Your account or password is incorrect.");
  }
  return await findUserById(user._id);
};

const registerByCredentials = async (username, password) => {
  let user = await userModel.findOne({ username }).exec();
  if (user) {
    throw Error.http(400, "Your account has been taken, please try again.");
  }
  user = await userModel.create({ username, password });
  if (!user) {
    throw Error.http(400, "Register failed, please try again.");
  }
  return await findUserById(user._id);
};

const joinByCredentials = async (username, password, code, autoJoin) => {
  // verify if the code have been used
  const invitation = await invitationService.findInvitationByCode(code);
  if (invitation.to) {
    throw Error.http(400, "The invitation code has been used.");
  }

  // get invitor's project
  const invitor = await findUserById(invitation.from);

  // find current user if exists
  let user = await userModel
    .findOne({ username, password })
    .populate("project")
    .exec();

  // when current user exists
  if (user) {
    user = user.toObject();
    // current user has no project and wants to join invitor's project
    if (
      !user.project &&
      autoJoin &&
      invitor.project &&
      user._id != invitation.from._id
    ) {
      await invitationService.acceptInvitation(invitation._id, user._id);
      await joinProject(user._id, invitor.project._id);
      return `Congratulations! You(${user.username}) have joind ${invitor.project.name}!`;
    }
    // otherwise, show success page to current user
    return `Welcome back, ${user.username}!`;
  }

  // when current user does't exist, register user automaticly
  // create a new user
  user = await userModel.create({ username, password });
  if (!user) {
    throw Error.http(400, "Register failed, please try again.");
  }
  user = user.toObject();

  // user wants to join invitor's project after registration
  if (autoJoin && invitor.project) {
    await invitationService.acceptInvitation(invitation._id, user._id);
    await joinProject(user._id, invitor.project._id);
    return `Congratulations! You(${user.username}) have signed up successfully and joind ${invitor.project.name}!`;
  }
  // otherwise, show success page to current user
  return `Congratulations! You(${user.username}) have signed up successfully!`;
};

exports.findUserById = findUserById;
exports.findUsersByProjectId = findUsersByProjectId;
exports.changeAvatar = changeAvatar;
exports.joinProject = joinProject;
exports.exitProject = exitProject;
exports.loginByCredentials = loginByCredentials;
exports.registerByCredentials = registerByCredentials;
exports.joinByCredentials = joinByCredentials;
