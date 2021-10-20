const url = require("url");
const urlDecider = function (setupType, targetAddr) {
  if (setupType === "on") {
    return `https://cloud.hubitat.com/api/${targetAddr}/apps`;
  } else return `http://${targetAddr}/apps/api`;
};

exports.buildURL = function (setupType, targetAddr, appID, apiKey, endpoint = "all", status = "") {
  const urlStart = urlDecider(setupType, targetAddr);
  const url = `${urlStart}/${appID}/devices/${endpoint}${status}?access_token=${apiKey}`;
  return url;
};
