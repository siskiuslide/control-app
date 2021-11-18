//Script.js is for generic functions that are shared between multiple pages that aren't large enough to warrant their own script.

const emptyText = `<div class="emptyText">No results to show</div>`

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

//favourite item (change data)
const favouriteItemIcon = function (e, typeClassName, buttonOnly, secondaryIcon) {
  e.target.classList.toggle('.favourited')
  let favouriteStatus;
  console.log(e.target.classList)
  if (e.target.classList.contains("favourited")) {
    e.target.textContent = "star";
    if(buttonOnly == false){
      favouriteStatus = true;
    }
  } else {
    e.target.textContent = secondaryIcon;
    if(buttonOnly==false){
      favouriteStatus = false;
    }
  }
  //for controls
  if(buttonOnly == false){
    const parent = e.target.closest(`.${typeClassName}`);
    const favouriteUpdate = {
      configID: parent.dataset.configid,
      favourite: favouriteStatus,
    };
    if(typeClassName == 'control'){favouriteUpdate.deviceID = parent.id}
    return favouriteUpdate;
  }
};

const getFavouriteItems = async function(type, favouriteQuery){
  let favQueryResult
  if(type == 'config'){
    favQueryResult = await fetch(`/${type}?favourite=${favouriteQuery}`).then(res=>res.json()).catch(err=>console.log(err))
  }
  if(type == 'devices'){
    
  }
}



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
