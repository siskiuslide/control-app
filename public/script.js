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

const favouriteItem = function (e, typeClassName, buttonOnly, secondaryIcon) {
  let favouriteStatus;
  
  e.target.classList.toggle("favourited");
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
  if(buttonOnly == false){
    const parent = e.target.closest(`.${typeClassName}`);
    const favouriteUpdate = {
      configID: parent.dataset.configid,
      deviceID: parent.id,
      favourite: favouriteStatus,
    };
    return favouriteUpdate;
  }
};

const getFavouriteItems = async function(type, favouriteQuery){
  let favQueryResult
  if(type == 'config'){
    favQueryResult = await fetch(`/${type}?favourite=${favouriteQuery}`).then(res=>res.json()).catch(err=>console.log(err))
  }
  if(type == 'devices'){
    let activeConfId = document.querySelector('.activeConfig').id
    favQueryResult = await fetch(`/config/${activeConfId}/devices?favourite=${favouriteQuery}`).then(res=>res.json()).catch(err=>console.log(err))
console.log(favQueryResult)
    progressiveFadeOut(document.querySelectorAll('.control'), 25)
    favQueryResult.data.forEach(device=> addDevice(device))
    progressiveFadeIn(document.querySelectorAll('.control'), 75, 'flex')
  }

  console.log(favQueryResult)

    //handle config favs
    // if(type == 'configFavGetter'){
    //   const firstFavourite = favQueryResult[0]._id;
    //   const firstFavDevices = await getDevices(firstFavourite);
    //   firstFavDevices.data.forEach((device) => {
    //     addDevice(device);
    //     progressiveFadeIn(document.querySelectorAll(".control"), 75, "flex");
    //   });
    //   //remove all entries
    //   progressiveFadeOut(document.querySelectorAll(".configListEntry"));
    //   progressiveFadeOut(document.querySelectorAll(".control"));
    //   //add a new entry for each favourite
    //   favQueryResult.forEach((conf) => {
    //     addConfig(conf);
    //   });
    //   //display it
    //   progressiveFadeIn(document.querySelectorAll(".configListEntry"), 75, "flex");
    // }

    // //handle device favs
    // if(type == 'devicesFavGetter'){
    //   const currentlyActiveConfig = document.querySelector('.activeConfig').id
    //   const favDevices = await getDevices(currentlyActiveConfig)
    //   favDevices.forEach(device=>{
    //     addDevice(device)
    //   })


    // }
}


// checkActiveConfigForPolling()

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
