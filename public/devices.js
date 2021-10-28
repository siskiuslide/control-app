//inserting dynamic elements
const addConfig = function (config) {
  const configListContainer = document.querySelector(".configListContainer");
  let configEntryHTML = `<div class="configListItem configListEntry inactiveConfig ${entryPollingStatus(config)}" id="${
    config._id
  }">
  <span class="configEntryFavourite material-icons ${setFavIconStyle(config)}">${setFavIcon(config)}</span>
    <div class="entryTitle">${config.name}</div>
    <span class="material-icons chevron-icon entry-chevron-icon">chevron_right</span>
    </div>`;
  configListContainer.insertAdjacentHTML("beforeEnd", configEntryHTML);
};

const addDevice = function (device) {
  const deviceContainer = document.querySelector(".deviceContainer");
  let deviceHTML = `   
    <div id="${device.deviceID}" class="control ${device.status}" data-type="${device.type}" data-label="${
    device.label
  }" data-configid="${device.configID}">
      <div class="controlLabel">${device.label}</div>
      <div class="controlStatusIconCont ${setStatusStyle(device)}">
        <span class="material-icons status-icon ">${setStatusIcon(device)}</span>
      </div>
      <div class="controlFooterSection">
        <div class="controlFooterItem">
          <span class="material-icons favourite-icon ${setFavIconStyle(device)} control-fav-icon">
          ${setFavIcon(device)}
          </span>
          </div>
        <div class="controlFooterItem">
          <span class="material-icons delete-icon control-del-icon">
          delete
          </span>
        </div>
      <div class="controlFooterItem"><span class="material-icons control-chevron-icon">chevron_right</span>
      </div>
  </div>
</div>`;
  deviceContainer.insertAdjacentHTML("afterbegin", deviceHTML);
};

//List Entry
const activeToggle = function (entry) {
  entry.classList.toggle("activeConfig");
  entry.classList.toggle("inactiveConfig");
};

//Device list
const dlIconToggle = function (target, onClass, offClass, onIcon, offIcon) {
  target.classList.toggle(onClass);
  target.classList.toggle(offClass);
  if (target.classList.contains(onClass)) {
    target.textContent = onIcon;
  } else if (target.classList.contains(offClass)) {
    target.textContent = offIcon;
  }
};

const removeDevicesFromCont = function (entry) {
  document.querySelectorAll(".control").forEach((control) => {
    if (control.id !== entry.id) {
      fadeOut(control, 100);
    }
  });
};

//
//Polling functions
//

const entryPollingStatus = function (config) {
  let className;
  config.polling == "on" ? (className = "pollingOn") : (className = "pollingOff");
  return className;
};

const checkActiveConfigForPolling = function (active) {
  let pollingBtn = document.querySelector(".pollSwitch");
  let pollingStatus;
  if (active.classList.contains("pollingOn")) {
    dlIconToggle(pollingBtn, "pollOn", "pollOff", "timer", "timer_off");
    pollingStatus = true;
    return pollingStatus;
  }
};
const pollDevices = function (active) {
  let interval;
  interval = setInterval(async () => {
    document.visibilityState === "visible" ? (visible = true) : (visible = false);
    if (visible === true) {
      const pollRes = await getDevices(document.querySelector(".activeConfig").id);
      comparePollDevices(pollRes.data);
    }
  }, 1000);
  return interval;
};

const comparePollDevices = function (pollData) {
  pollData.forEach((device) => {
    const deviceEl = document.getElementById(`${device.deviceID}`);
    const deviceState = device.status;
    if (!deviceEl.classList.contains(`${device.status}`)) {
      updateControlStyle(device.status, deviceEl, deviceEl.querySelector(".controlStatusIconCont"));
    }
  });
};

//
//Controls
//

//style on load
const setStatusStyle = function (device) {
  let statusStyle;
  device.status === "on" ? (statusStyle = "device-on") : (statusStyle = "device-off");
  return statusStyle;
};

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
//exclude device
const excludeItem = function (e, parentClassName, type) {
  const parent = e.target.closest(`.${parentClassName}`);
  const updateBody = {
    configID: parent.dataset.configid,
    excluded: true,
  };
  if (type === "device") {
    updateBody.deviceID = parent.id;
  }
  return updateBody;
};

//------------------------
//page LOAD event listener
//------------------------

window.addEventListener("load", async (e) => {
  //request configs first & add them to the list
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

  //get the devices from the first config in the list
  const firstConfig = document.querySelector(".configListEntry");
  const loadDevices = await getDevices(firstConfig.id);
  activeToggle(document.getElementById(firstConfig.id));

  if (loadDevices.data.length > 0) {
    loadDevices.data.forEach((device) => {
      if (device.excluded == true) {
        return;
      }
      addDevice(device);
      progressiveFadeIn(document.querySelectorAll(".control"), 75, "flex");
    });
  } else {
    document.querySelector(".deviceListContainer").insertAdjacentHTML("afterbegin", emptyText);
  }

  //header event listeners
  const headerIcon = document.querySelectorAll(".headerIcon");
  console.log(headerIcon);
  headerIcon.forEach((icon) => {
    icon.addEventListener("click", async (e) => {
      if (e.target.classList.contains("header-fav-icon")) {
        e.target.classList.toggle("favourited");
        let favouriteQuery;
        e.target.classList.contains("favourited") ? (favouriteQuery = true) : (favouriteQuery = false);
        const favQueryResult = await fetch(`/config?favourite=${favouriteQuery}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            return data.body;
          })
          .catch((err) => console.log(err));

        //fetch the data for the first in list
        const firstFavourite = favQueryResult[0]._id;
        const firstFavDevices = await getDevices(firstFavourite);
        console.log(firstFavDevices.data);
        firstFavDevices.data.forEach((device) => {
          addDevice(device);
          progressiveFadeIn(document.querySelectorAll(".control"), 75, "flex");
        });

        //remove all entries
        progressiveFadeOut(document.querySelectorAll(".configListEntry"));
        progressiveFadeOut(document.querySelectorAll(".control"));
        //add a new entry for each favourite
        favQueryResult.forEach((conf) => {
          addConfig(conf);
        });

        //display it
        progressiveFadeIn(document.querySelectorAll(".configListEntry"), 75, "flex");
      }
    });
  });

  //entries
  const entries = document.querySelectorAll(".configListEntry");
  entries.forEach((entry) => {
    entry.addEventListener("click", async (e) => {
      progressiveFadeOut(document.querySelectorAll(".control"), 30);
      const target = e.target.closest(".configListEntry");
      const targetID = target.id;
      const currentlyActive = document.querySelector(".activeConfig");
      const targetURL = `/config/${targetID}/devices`;
      devices = await fetch(targetURL)
        .then((res) => {
          return res.json();
        })
        .then((devices) => {
          if (currentlyActive !== e.target) {
            activeToggle(currentlyActive);
            activeToggle(target);
          }
          devices.data.forEach((device) => addDevice(device));
          progressiveFadeIn(document.querySelectorAll(".control"), 75, "flex");
        })
        .catch((err) => console.log(err));
    });
  });

  //-----------------------
  //DL Icon event listeners
  //-----------------------

  //polling

  let pollInterval;
  const activeConfig = document.querySelector(".activeConfig");
  if (checkActiveConfigForPolling(activeConfig) == true) {
    pollInterval = pollDevices(activeConfig);
  }

  const pollSwitchBtn = document.querySelector(".pollSwitch");
  pollSwitchBtn.addEventListener("click", () => {
    dlIconToggle(pollSwitchBtn, "pollOn", "pollOff", "timer", "timer_off");
    if (pollSwitchBtn.classList.contains("pollOn")) {
      pollDevices(activeConfig);
    }
    if (pollSwitchBtn.classList.contains("pollOff")) {
      clearInterval(pollInterval);
    }
  });

  //visibility

  let visibilitySwitchBtn = document.querySelector(".visibilitySwitch");
  visibilitySwitchBtn.addEventListener("click", () => {
    dlIconToggle(visibilitySwitchBtn, "visible", "invisible", "visibility", "visibility_off");
  });

  //event listeners for each device
  const controls = document.querySelectorAll(".control");
  controls.forEach((control) => {
    control.addEventListener("click", async (e) => {
      e.preventDefault();
      //favourite Button
      if (e.target.classList.contains("favourite-icon")) {
        const updateObj = favouriteItem(e, "control");
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
        return;
      }
      if (e.target.classList.contains("delete-icon")) {
        const updateObj = excludeItem(e, "control", "device");
        await fetch(`/devices/${updateObj.configID}`, {
          method: "PATCH",
          body: JSON.stringify(updateObj),
          headers: { "content-type": "application/json" },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            return data;
          })
          .catch((err) => {
            console.log(err);
          });
        return;
      }

      //STATE CHANGE
      //get new state & set the style instantly
      const targetState = getNewState(control);
      const button = control.querySelector(".controlStatusIconCont");
      const newStateStyle = updateControlStyle(targetState, control, button);
      //make the request to the server
      const data = await fetch(`/devices/${control.dataset.configid}/${control.id}/${targetState}`)
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      //check if the result matches the instantly updated status then toggle back if it doesn't
      const newStatusFromServer = data.data.attributes.find((attr) => attr.name == "switch");
      if (newStatusFromServer.currentValue !== targetState) {
        setStatusStyle(control);
      }
    });
  });
});
