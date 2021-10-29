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

/////Config get devices
const getDevices = async (config) => {
  const data = await fetch(`/config/${config}/devices`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
  return data;
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

checkActiveConfigForPolling()



//
//Nav Bar effects
//
const listItems = document.querySelectorAll(".nav-item");
listItems.forEach((item, i) => {
  if (i != listItems.length - 1) {
    item.style.borderRight = "2px solid rgb(66,66,66)";
  }
  item.addEventListener("mouseout", () => {
    item.style.transition = "transform 1000ms";
  });
});
