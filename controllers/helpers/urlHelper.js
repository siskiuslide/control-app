const url = require("url");
const urlDecider = function (setupType, targetAddr) {
  if (setupType === "on") {
    return `https://cloud.hubitat.com/api/${targetAddr}/apps`;
  } else return `http://${targetAddr}/apps/api`;
};

exports.buildURL = function (setupType, targetAddr, appID, apiKey, endpoint = "devices", endpoint2 = "all") {
  const urlStart = urlDecider(setupType, targetAddr);
  const url = `${urlStart}/${appID}/${endpoint}/${endpoint2}?access_token=${apiKey}`;
  return url;
};
