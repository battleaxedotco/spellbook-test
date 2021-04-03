const format = require("date-fns").format;

function getTimestamp(ms = null, pattern = "h:mm:ss b") {
  return format(ms || Date.now(), pattern);
}

function getDate(ms = null, pattern = "LL/dd/yyy") {
  return format(ms || Date.now(), pattern);
}

module.exports = {
  getTimestamp,
  getDate,
};
