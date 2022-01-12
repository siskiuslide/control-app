//Script.js is for generic code that is shared between multiple pages that isn't large enough to warrant their own script.
//set localstorage defaults
window.localStorage.setItem('mostRecentPage', '/config.html')


const emptyText = `<div class="error">
  <span class="material-icons">error</span>
  <p></p>
</div>`;
const throwError = function (targetEl, position, message, additionalClass) {
  document.querySelector(`${targetEl}`).insertAdjacentHTML(position, emptyText);
  const error = document.querySelector(".error");
  error.querySelector("p").textContent = message;
  if (additionalClass) {
    error.classList.add(additionalClass);
  }
  fadeIn(error, 150, "flex");
};
const removeErrorMessage = function () {
  const errorMessages = document.querySelectorAll(".error");
  if (!errorMessages) return;
  errorMessages.forEach((err) => {
    fadeOut(err, 50);
  });
};

//navbar elements
const navBar = document.querySelector(".navbar");
const navItems = document.querySelectorAll(".nav-item");
const navItemText = document.querySelectorAll(".nav-item-text");
const loginButton = document.querySelector("login-account");
const activeItem = document.querySelector(".nav-active");
const activeItemText = document.querySelector(".nav-text-active");
let hoverStyle; //Item hover style (dark)
let originalTextColor;
let activeTextStyle = "var(--midAccent)";
let activeTextHoverStyle; //style active text when hovered

//homepage navbar styling logic
if (navBar && navBar.classList.contains("homeNav")) {
  originalTextColor = "black";
  hoverStyle = "rgba(255, 255, 255, 0.466)";
  activeTextHoverStyle = "black";
  navItems.forEach((item) => {
    item.style.borderRight = null;
    const itemText = item.querySelector(".nav-item-text");
    itemText.style.color = "black";
  });
} else {
  hoverStyle = "rgb(60,60,60)";
  activeTextHoverStyle = "white";
  originalTextColor = "white";
}
//apply styles set in logic above
navItems.forEach((item) => {
  const itemText = item.querySelector("a").querySelector("p");
  item.addEventListener("click", () => {
    window.localStorage.setItem("mostRecentPage", item.querySelector("a").getAttribute("href")); //set this to local storage to redirect users when they login
  });

  activeItemText.style.color = activeTextStyle;
  item.addEventListener("mouseenter", () => {
    item.style.background = hoverStyle;
    if (item.classList.contains("nav-active")) {
      itemText.style.color = activeTextHoverStyle;
    }
  });
  item.addEventListener("mouseout", () => {
    item.style.background = null;
    if (item.classList.contains("nav-active")) {
      itemText.style.color = activeTextStyle;
    } else {
      itemText.style.color = originalTextColor;
    }
  });
});

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

//this is to fade in elements that are targets of el.GetBoundingClientRect
let fadeInOpacOnly = function (element, duration) {
  element.style.transition = `opacity ${duration}ms`;
  element.style.opacity = "1";
};

let progressiveFadeIn = function (nodelist, interval, orntn) {
  // take a nodelist and fade in on interval
  nodelist.forEach((el, i) => fadeIn(el, interval * i, orntn));
};
let progressiveFadeOut = function (nodelist, interval) {
  //take a nodelist and fade each one out using an interval
  nodelist.forEach((el, i) => {
    fadeOut(el, interval * i);
    el.remove();
  });
};

///Config get devices
const getDevices = async (config) => {
  const data = await fetch(`/config/${config}/devices`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
  return data;
};

//Favouriting (on load)
const setFavIcon = (obj) => {
  obj.favourite == true ? (favouriteContent = "star") : (favouriteContent = "star_outline");
  return favouriteContent;
};

const setFavIconStyle = (obj) => {
  obj.favourite == true ? (favouriteClass = "favourited") : (favouriteClass = "");
  return favouriteClass;
};
const checkCurrentFavState = function (element) {
  let currentState;
  element.querySelector(".favourite-icon").classList.contains("favourited")
    ? (currentState = true)
    : (currentState = false);
  return currentState;
};
const getNewFavState = function (currentState) {
  let newState;
  currentState == true ? (newState = false) : (newState = true);
  return newState;
};

const updateFavStyle = function (target, newState) {
  newState === true ? target.classList.add("favourited") : target.classList.toggle("favourited");
  newState === false ? (target.textContent = "star_outline") : (target.textContent = "star");
};

const favouriteObj = function (type, element, newState) {
  let favUpdate = {
    newState: newState,
  };
  if (type == "control") {
    favUpdate.endpoint = `/devices/${element.dataset.configid}`;
    favUpdate.configID = element.dataset.configid;
    favUpdate.deviceID = element.id;
  }
  if (type == "config") {
    favUpdate.endpoint = `/config`;
    favUpdate.configID = element.id;
  }
  return favUpdate;
};

const favSortDecider = function (sortBtn) {
  let sort;
  sortBtn.classList.contains("favSort") ? (sort = true) : (sort = false);
  return sort;
};
