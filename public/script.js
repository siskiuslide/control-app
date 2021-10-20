//Generic UI Features
let fadeOut = function (element, duration) {
  element.style.transition = `opacity ease-out ${duration + "ms"}`;
  element.style.opacity = 0;
  setTimeout(() => {
    element.style.display = "none";
  }, (duration += 10));
};
let fadeIn = function (element, duration, orntn) {
  element.style.opacity = 0;
  element.style.display = `${orntn}`;
  element.style.transition = `opacity ease-in ${duration + "ms"}`;
  setTimeout(() => {
    element.style.opacity = 1;
  }, (duration += 10));
};

let progressiveFadeIn = function (nodelist, interval, orntn) {
  nodelist.forEach((el, i) => fadeIn(el, interval * i, orntn));
};
let progressiveFadeOut = function (nodelist, interval) {
  nodelist.forEach((el, i) => {
    fadeOut(el, interval * i);
    el.remove();
  });
};

//Favouriting Items
const setFavIcon = (obj) => {
  obj.favourite == true ? (favouriteContent = "star") : (favouriteContent = "star_outline");
  return favouriteContent;
};

const setFavIconStyle = (obj) => {
  obj.favourite == true ? (favouriteClass = "favourited") : (favouriteClass = "");
  return favouriteClass;
};

const favouriteItem = function (e, parentClassName) {
  e.target.classList.toggle("favourited");
  const parent = e.target.closest(`.${parentClassName}`);
  let favouriteStatus;
  if (e.target.classList.contains("favourited")) {
    e.target.textContent = "star";
    favouriteStatus = true;
  } else {
    e.target.textContent = "star_outline";
    favouriteStatus = false;
  }
  const favouriteUpdate = {
    configID: parent.dataset.configid,
    deviceID: parent.id,
    favourite: favouriteStatus,
  };
  return favouriteUpdate;
};

///change device state
const getNewState = function (control) {
  let newStatus;
  control.classList.contains("on") ? (newStatus = "off") : (newStatus = "on");
  return newStatus;
};
const updateControlStyle = function (newStatus, control, button) {
  let newStyle;
  newStatus == "on" ? (newStyle = "off") : (newStyle = "on");
  control.classList.toggle("on");
  control.classList.toggle("off");
  button.classList.toggle("device-off");
  button.classList.toggle("device-on");
};

//check matching status, if !matching set back to irl status

//icons on load
const setStatusIcon = function (device) {
  let icon;
  //lights
  if (
    device.type.includes("Light") ||
    device.type.includes("Bulb") ||
    device.type.includes("Strip") ||
    device.type.includes("RGB")
  ) {
    return (icon = "lightbulb");
  }
  //powered devices
  if (device.type.includes("Switch") || device.type.includes("Plug") || device.type.includes("Controller")) {
    return (icon = "bolt");
  }
};
//style on load
const setStatusStyle = function (device) {
  let statusStyle;
  device.status === "on" ? (statusStyle = "device-on") : (statusStyle = "device-off");
  return statusStyle;
};
/////////////////////////

//Nav Bar effects
const listItems = document.querySelectorAll(".nav-item");
listItems.forEach((item, i) => {
  if (i != listItems.length - 1) {
    item.style.borderRight = "2px solid rgb(66,66,66)";
  }
  item.addEventListener("mouseout", () => {
    item.style.transition = "transform 1000ms";
  });
});
