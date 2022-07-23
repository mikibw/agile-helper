const invitationModel = require("../models/invitation");
const Code = require("../utils/ID");
const userService = require("./user");

const findInvitationByCode = async (code) => {
  const invitation = await invitationModel
    .findOne({ code })
    .populate("from to", "username avatar")
    .exec();
  if (!invitation) {
    throw Error.http(404, "The invitation code is unavailable.");
  }
  return invitation.toObject();
};

const createInvitationCode = async (uid) => {
  const user = await userService.findUserById(uid);
  const invitation = await invitationModel.create({
    code: Code(),
    from: user._id,
  });
  if (!invitation) {
    throw Error.http(404, "Create invitation code failed.");
  }
  return invitation.toObject().code;
};

const acceptInvitation = async (id, uid) => {
  const invitation = await invitationModel
    .findOneAndUpdate({ _id: id }, { to: uid })
    .exec();
  if (!invitation) {
    throw Error.http(404, "Accept invitation failed.");
  }
  return invitation.toObject();
};

module.exports = {
  findInvitationByCode,
  createInvitationCode,
  acceptInvitation,
};
