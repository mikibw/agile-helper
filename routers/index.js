const router = require("koa-router")();
const user = require("./user");
const update = require("./update");
const project = require("./project");
const invitation = require("./invitation");
const tag = require("./tag");

router
  .prefix("/v1")
  .use(user.routes())
  .use(update.routes())
  .use(project.routes())
  .use(invitation.routes())
  .use(tag.routes());

module.exports = router;
