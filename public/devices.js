const addConfig = function (config) {
  const configListContainer = document.querySelector(".configListContainer");
  let configEntryHTML = `<div class="configListItem configListEntry inactiveConfig" id="${config._id}">
    <div class="entryTitle">${config.name}</div>
    <span class="material-icons chevron-icon entry-chevron-icon">chevron_right</span>
    </div>`;
  configListContainer.insertAdjacentHTML("beforeEnd", configEntryHTML);
};

const addDevice = function (device) {
  const deviceContainer = document.querySelector(".deviceContainer");
  let deviceHTML = `  <div id="${device.configID}" class="control" data-type="${device.type}" data-label="${device.label}">
  <div class="typeDecorTemplate"></div>
  <div class="controlLabel">${device.label}</div>
  <div src="" class="controlImage">image here</div>
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
        });
      }
    })
    .catch((err) => console.log(err));
  //ADD CONFIG TO LIST

  const firstConfig = document.querySelector(".configListEntry");
  const onloadDevices = await fetch(`/config/${firstConfig.id}/devices`)
    .then((res) => {
      removeActive(firstConfig);
      return res.json();
    })
    .catch((err) => console.log(err));
  onloadDevices.data.forEach((device) => {
    addDevice(device);
  });

  const entries = document.querySelectorAll(".configListEntry");
  entries.forEach((entry) => {
    entry.addEventListener("click", async (e) => {
      removeActive(document.getElementById(firstConfig.id));
      const target = e.target.closest(".configListEntry");
      const targetID = target.id;
      const devices = await fetch(`/config/${targetID}/devices`)
        .then((res) => {
          makeActive(target);
          return res.json();
        })
        .catch((err) => console.log(err));
      console.log(devices);
    });
  });
});
