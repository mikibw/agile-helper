const invitationService = require("../services/invitation");

const createInvitationCode = async (ctx, next) => {
  ctx.success({
    code: await invitationService.createInvitationCode(ctx.getUserId()),
  });
};

module.exports = {
  createInvitationCode,
};
