const router = require("koa-router")();
const userController = require("../controllers/user");
const multipart = require("koa-body")({ multipart: true });

router
  .prefix("/users")
  .get("/", userController.findUserById)
  .put("/avatar", multipart, userController.changeAvatar)
  .post("/project", userController.joinProject)
  .delete("/project", userController.exitProject)
  .post("/login", userController.loginByCredentials)
  .post("/register", userController.registerByCredentials)
  .post("/join", userController.joinByCredentials);

module.exports = router;
