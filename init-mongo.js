const { mongodb } = require("./config/config.prd");
db.createUser({
  user: mongodb.username,
  pwd: mongodb.password,
  roles: [
    {
      role: "readWrite",
      db: mongodb.database,
    },
  ],
});
