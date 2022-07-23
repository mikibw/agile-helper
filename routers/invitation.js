const router = require("koa-router")();
const invitationController = require("../controllers/invitation");

router
  .prefix("/invitations")
  .post("/", invitationController.createInvitationCode);

module.exports = router;
