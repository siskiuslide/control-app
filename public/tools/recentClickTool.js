//recentClick is used to avoid UI bugs whilst a config is polling where the UI changes before the result of the poll comes back.
// Avoids the flickering issue that sometimes occurs
let recentClick = false;

recentClickChecker = function () {
  let returnVal;
  recentClick = true ? (returnVal = true) : (returnVal = false);
  return returnVal;
};

applyRecentClick = function () {
  recentClick = true;
  return recentClick;
};
recentClickTimeout = function (timeout) {
  setTimeout(() => {
    recentClick = false;
    return recentClick;
  }, timeout);
  return recentClick;
};
