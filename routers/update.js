const router = require("koa-router")();
const updateController = require("../controllers/update");

router
  .prefix("/updates")
  .get("/", updateController.findUpdates)
  .post("/", updateController.createUpdate)
  .put("/:id", updateController.changeUpdate)
  .delete("/:id", updateController.deleteUpdate);

module.exports = router;
