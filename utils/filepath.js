const path = require("path");

module.exports = {
  local: (filename) => {
    const dir = path.resolve("resources", "upload");
    return filename ? path.join(dir, filename) : dir;
  },
  remote: (origin, filename) => {
    return filename && `${origin}/upload/${filename}`;
  },
};
