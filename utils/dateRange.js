const moment = require("moment");

module.exports = (date) => {
  let day = new Date(date);
  const start = moment(day).startOf("day").toDate();
  const end = moment(day).add(1, "d").startOf("day").toDate();
  return { start, end };
};
