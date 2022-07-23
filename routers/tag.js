const router = require("koa-router")();
const tagController = require("../controllers/tag");

router
  .prefix("/tags")
  .get("/:id", tagController.findTagById)
  .post("/", tagController.createTag)
  .put("/:id/name", tagController.changeName)
  .put("/:id/roster", tagController.changeRoster)
  .delete("/:id", tagController.deleteTag);

module.exports = router;
