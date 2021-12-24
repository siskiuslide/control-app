const getAndDisplayDevices = async function (activeId) {
  const devices = await getDevices(activeId);
  if (devices.data.length > 0) {
    devices.data.forEach((device) => {
      addDevice(device);
    });
    const controls = document.querySelectorAll(".control");
    progressiveFadeIn(controls, 10, "flex");
  } else {
    return throwError(".deviceListSection", "beforeend", "No Devices found for this network:/", "deviceListError");
  }
};

//inserting dynamic elements
const addConfig = function (config) {
  const configListContainer = document.querySelector(".configListContainer");
  let configEntryHTML = `<div class="configListItem configListEntry inactiveConfig ${entryPollingStatus(config)}" id="${
    config._id
  }">
  <span class="configEntryFavourite material-icons ${setFavIconStyle(config)}">${setFavIcon(config)}</span>
    <p class="entryTitle">${config.name}</p>
    <span class="material-icons chevron-icon entry-chevron-icon">chevron_right</span>
    </div>`;
  configListContainer.insertAdjacentHTML("beforeEnd", configEntryHTML);
};

const addDevice = function (device) {
  const deviceContainer = document.querySelector(".deviceContainer");
  const existing = document.getElementById(`${device.deviceID}`);
  if (existing == null) {
    let deviceHTML = `   
    <div id="${device.deviceID}" class="control ${device.status}" data-type="${device.type}" data-label="${
      device.label
    }" data-configid="${device.configID}">
  <h1>${device.label}</h1>
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
        <div class="controlFooterItem"><a href="deviceView.html"><span class="material-icons control-chevron-icon">chevron_right</span></a>
        </div>
        </div>
      </div>`;
    deviceContainer.insertAdjacentHTML("afterbegin", deviceHTML);
  }
};

//List Entry
const activeToggle = function (entry) {
  entry.classList.toggle("activeConfig");
  entry.classList.toggle("inactiveConfig");
};

//Device list
const pollingIconToggle = function (pollingBool) {
  const onClass = "pollOn";
  const offClass = "pollOff";
  const onIcon = "timer";
  const offIcon = "timer_off";
  const target = document.querySelector(".pollSwitch");

  //for the eventlistener to change state without knowing
  if (pollingBool === undefined) {
    target.classList.toggle(onClass);
    target.classList.toggle(offClass);
    target.classList.contains(onClass) ? (target.textContent = onIcon) : (target.textContent = offIcon);
  }
  //T/F are given when clicking on a config entry
  if (pollingBool == true) {
    target.textContent = "timer";
    target.classList.add(onClass);
    target.classList.remove(offClass);
    return true;
  }
  if (pollingBool == false) {
    target.textContent = "timer_off";
    target.classList.add(offClass);
    target.classList.remove(onClass);
    return false;
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
    pollingStatus = true;
    pollingIconToggle(pollingStatus);
  } else if (active.classList.contains("pollingOff")) {
    pollingStatus = false;
    pollingIconToggle(pollingStatus);
  }
  return pollingStatus;
};

const pollDevices = async function (active, refreshFlag) {
  let interval;
  let pollSwitch = document.querySelector(".pollSwitch");
  document.visibilityState === "visible" ? (visible = true) : (visible = false);
  //if this is called when page is refreshed, don't set an interval to loop
  if (refreshFlag == true) {
    const pollRes = await getDevices(document.querySelector(".activeConfig").id);
    return comparePollDevices(pollRes.data);
  }
  if (visible === true && pollSwitch.classList.contains("pollOn") && refreshFlag == false) {
    interval = setInterval(async () => {
      const pollRes = await getDevices(active.id);
      comparePollDevices(pollRes.data);
    }, 1000);
    return interval;
  }
};

const comparePollDevices = function (pollData) {
  pollData.forEach((device) => {
    const deviceEl = document.getElementById(`${device.deviceID}`);
    const deviceState = device.status;
    if (!deviceEl.classList.contains(`${device.status}`) && recentClick === false) {
      updateControlStyle(device.status, deviceEl, deviceEl.querySelector(".controlStatusIconCont"));
    }
  });
};
////////////
//Controls//
////////////

//style controls on load
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
    device.type.includes("RGB") ||
    device.type.includes("Outlet")
  ) {
    return (icon = "lightbulb");
  }
  //powered devices
  if (device.type.includes("Switch") || device.type.includes("Plug") || device.type.includes("Controller")) {
    return (icon = "bolt");
  }
};

///Change device state
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

//refresh page when focused to poll 1x
window.addEventListener("focus", () => {
  // location.reload();
});

//------------------------
//page LOAD event listener
//------------------------
window.addEventListener("load", async (e) => {
  //request configs first & add them to the list
  const configResponse = await fetch("/config")
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  configResponse.body.forEach((config) => {
    addConfig(config);
  });
  progressiveFadeIn(document.querySelectorAll(".configListEntry"), 5, "flex");

  //search localstorage for mostrecent, or acquire the first
  let onLoadConfig;
  let storedConfig = localStorage.getItem("mostRecentConfig");
  //below condition sets storedConfig to null before the ternary logic, if the config doesn't exist
  if (document.getElementById(storedConfig) == null) {
    storedConfig = null;
  }
  storedConfig !== null
    ? (onLoadConfig = document.getElementById(storedConfig))
    : (onLoadConfig = document.querySelector(".configListEntry"));

  if (document.querySelector(".configListEntry") == null) {
    return throwError(".deviceListSection", "beforeend", "Add a network before controlling devices", "deviceListError");
  }

  // const loadDevices = await getDevices(onLoadConfig.id);
  getAndDisplayDevices(onLoadConfig.id);
  activeToggle(document.getElementById(onLoadConfig.id));
  pollDevices(document.querySelector(".activeConfig"), true);

  // if (loadDevices.status == "error") {
  //   return throwError(".deviceListSection", "beforeend", "No Devices found for this network:/", "deviceListError");
  // } else {
  //   loadDevices.data.forEach((device) => {
  //     if (device.excluded == true) return;
  //     addDevice(device);
  //     progressiveFadeIn(document.querySelectorAll(".control"), 25, "flex");
  //   });
  // }

  //entries
  const entries = document.querySelectorAll(".configListEntry");
  entries.forEach((entry) => {
    entry.addEventListener("click", async (e) => {
      const target = e.target.closest(".configListEntry");
      const targetID = target.id;
      const currentlyActive = document.querySelector(".activeConfig");
      //set to storage so that it can be loaded on refresh
      localStorage.setItem("mostRecentConfig", targetID);
      if (currentlyActive !== e.target) {
        //change active
        activeToggle(currentlyActive);
        activeToggle(target);
        progressiveFadeOut(document.querySelectorAll(".control"), 30);
        //polling status (changes the icon too)
        checkActiveConfigForPolling(target);

        //make request
        const targetURL = `/config/${targetID}/devices`;
        devices = await fetch(targetURL)
          .then((res) => {
            return res.json();
          })
          .then((devices) => {
            //add control element for each device returned
            devices.data.forEach((device) => addDevice(device));
            progressiveFadeIn(document.querySelectorAll(".control"), 45, "flex");
          })
          .catch((err) => console.log(err));
        console.log(devices);
        pollDevices(target, true);
      }
    });
  });

  //polling
  const activeConfig = document.querySelector(".activeConfig");
  if (checkActiveConfigForPolling(activeConfig) == true) {
    pollDevices(activeConfig, false);
  }

  const pollSwitchBtn = document.querySelector(".pollSwitch");
  pollSwitchBtn.addEventListener("click", (e) => {
    pollingIconToggle();
    if (pollSwitchBtn.classList.contains("pollOn")) {
      pollDevices(activeConfig, false);
    }
  });

  //visibility
  let visibilitySwitchBtn = document.querySelector(".visibilitySwitch");
  visibilitySwitchBtn.addEventListener("click", () => {
    dlIconToggle(visibilitySwitchBtn, "visible", "invisible", "visibility", "visibility_off");
  });

  //event listeners
  window.addEventListener("click", async (e) => {
    //favourite Button
    const deviceContainer = document.querySelector(".deviceContainer");
    const activeConfig = document.querySelector(".activeConfig");
    if (e.target.classList.contains("control-fav-icon")) {
      const controlEl = e.target.closest(".control");
      const currentFavState = checkCurrentFavState(controlEl);
      const newFavState = getNewFavState(currentFavState);
      const updateObj = favouriteObj("control", controlEl, newFavState);
      e.preventDefault();
      updateFavStyle(e.target, newFavState);

      await fetch(`${updateObj.endpoint}`, {
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
    //sort by favourite (devices and configs)
    //messy but it works. will refactor using a Class system at some point
    if (e.target.classList.contains("header-fav-icon")) {
      //remove devices regardless of which context
      progressiveFadeOut(deviceContainer.querySelectorAll("*"), 10);
      //update button
      e.target.classList.toggle("favSort");
      //decide new state
      const sort = favSortDecider(e.target);
      //get endpoint based on context
      let endpoint;
      if (e.target.classList.contains("deviceFavGetter")) {
        endpoint = `/config/${activeConfig.id}/devices`;
      }
      if (e.target.classList.contains("configFavGetter")) {
        endpoint = `/config`;
        //if configs, remove them too
        progressiveFadeOut(document.querySelectorAll(".configListEntry"), 10);
      }
      //make request
      const sorted = await fetch(`${endpoint}?favourite=${sort}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          return data;
        })
        .catch((err) => console.log(err));

      console.log(sorted);

      if (sorted.data.length > 0) {
        //handle for each context
        if (e.target.classList.contains("deviceFavGetter")) {
          sorted.data.forEach((device) => {
            addDevice(device);
            return progressiveFadeIn(document.querySelectorAll(".control"), 10, "flex");
          });
        }
        if (e.target.classList.contains("configFavGetter")) {
          sorted.data.forEach((config) => {
            addConfig(config);
            progressiveFadeIn(document.querySelectorAll(".configListEntry"), 15, "flex");
          });
          const active = document.querySelector(".configListEntry");
          activeToggle(active);
          getAndDisplayDevices(active.id);
          return;
        }
      } else {
        return throwError(".deviceContainer", "beforeend", "No favourites set");
      }
    }
    //deleteicons
    if (e.target.classList.contains("control-del-icon")) {
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
          return data;
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }

    if (e.target.classList.contains("control") && e.target.classList.contains("control-chevron-icon")) {
      return;
    }

    //STATE CHANGE
    //get new state & set the style instantly
    if (
      e.target.classList.contains("control") ||
      e.target.classList.contains("controlStatusIconCont") ||
      e.target.classList.contains("status-icon")
    ) {
      const control = e.target.closest(".control");
      applyRecentClick();
      recentClickTimeout(1000);
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
      if (newStatusFromServer.currentValue !== targetState && recentClick === false) {
        setStatusStyle(control);
      }
    }
  });
});
