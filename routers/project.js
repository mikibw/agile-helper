const router = require("koa-router")();
const projectController = require("../controllers/project");

router
  .prefix("/projects")
  .get("/", projectController.findAllProjects)
  .post("/", projectController.createProject)
  .get("/users", projectController.findProjectAllUsers)
  .get("/tags", projectController.findProjectAllTags);

module.exports = router;
