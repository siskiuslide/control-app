const addConfig = function (config) {
  const configListContainer = document.querySelector(".configListContainer");
  let configEntryHTML = `<div class="configListItem configListEntry inactiveConfig" id="${config._id}">
    <div class="entryTitle">${config.name}</div>
    <span class="material-icons chevron-icon entry-chevron-icon">chevron_right</span>
    </div>`;
  configListContainer.insertAdjacentHTML("beforeEnd", configEntryHTML);
};

const addDevice = function (device) {
  console.log(setFavouriteIconStyle(device))
  const deviceContainer = document.querySelector(".deviceContainer");
  let deviceHTML = ` 
 <div id="${device.deviceID}" class="control" data-type="${device.type}" data-label="${device.label}" data-configID="${
    device.configID
  }">
  <div class="typeDecorTemplate"></div>
    <div class="controlLabel">${device.label}</div>
    <div src="" class="controlImage">image here</div>
    <div class="controlFooterSection">
      <div class="controlFooterItem"><span class="material-icons favourite-icon  ${setFavouriteIconStyle(device)} control-fav-icon">${setFavouriteIcon(device)}</span>
      </div>
      <div class="controlFooterItem"><a href="devices/${device.configID}/${device.deviceID}"><span class="material-icons control-chevron-icon">chevron_right</span></a>
      </div>
  </div>
</div>`;
  deviceContainer.insertAdjacentHTML("afterbegin", deviceHTML);
};

const removeActive = function (entry) {
  entry.classList.toggle("activeConfig");
  entry.classList.toggle("inactiveConfig");
};
const makeActive = function (entry) {
  entry.classList.toggle("activeConfig");
  entry.classList.toggle("inactiveConfig");
};

const removeDevicesFromCont = function (entry) {
  document.querySelectorAll(".control").forEach((control) => {
    if (control.id !== entry.id) {
      fadeOut(control, 100);
    }
  });
};

//ONLOAD - get all configs, then load the devices of the first in the list

let configListItems;
let configs = [];
window.addEventListener("load", async (e) => {
  const configResponse = await fetch("/config")
    .then((res) => res.json())
    .then((data) => {
      if (data.body.length > 0) {
        data.body.forEach((config) => {
          addConfig(config);
          progressiveFadeIn(document.querySelectorAll(".configListEntry"), 75, "flex");
        });
      }
    })
    .catch((err) => console.log(err));
  //ADD CONFIG TO LIST
  const firstConfig = document.querySelector(".configListEntry");
  const onloadDevices = await fetch(`/config/${firstConfig.id}/devices`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  if (onloadDevices.data.length > 0) {
    onloadDevices.data.forEach((device) => {
      removeActive(document.getElementById(firstConfig.id));
      addDevice(device);
      progressiveFadeIn(document.querySelectorAll(".control"), 75, "flex");
    });
  }

  const entries = document.querySelectorAll(".configListEntry");
  entries.forEach((entry) => {
    entry.addEventListener("click", async (e) => {
      progressiveFadeOut(document.querySelectorAll(".control"), 30);
      const target = e.target.closest(".configListEntry");
      const targetID = target.id;
      const currentlyActive = document.querySelector(".activeConfig");
      const devices = await fetch(`/config/${targetID}/devices`)
        .then((res) => {
          return res.json();
        })
        .then((devices) => {
          if (currentlyActive !== e.target) {
            removeActive(currentlyActive);
            makeActive(target);
          }
          devices.data.forEach((device) => addDevice(device));
          progressiveFadeIn(document.querySelectorAll(".control"), 75, "flex");
        })
        .catch((err) => console.log(err));
    });
  });

  const controls = document.querySelectorAll(".control");
  controls.forEach((control) => {
    control.addEventListener("click", async (e) => {
      //Favourite Btn
      if (e.target.classList.contains("favourite-icon")) {
        const updateObj = favouriteItem(e, "control");
        console.log(updateObj);

        await fetch(`/devices/${updateObj.configID}`, {
          method: "PATCH",
          body: JSON.stringify(updateObj),
          headers: { "content-type": "application/json" },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            return data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
});
