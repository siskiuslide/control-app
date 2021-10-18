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

const removeDevicesFromCont = function(entry){
    document.querySelectorAll('.control').forEach(control=> {if(control.id !== entry.id){fadeOut(control, 100)}})
}


//ONLOAD - get all configs, then load the devices of the first in the list

let configListItems;
let configs = [];
window.addEventListener("load", async (e) => {
  const configResponse = await fetch("/config")
    .then((res) => res.json())
    .then((data) => {
      if (data.body.length > 0) {
        data.body.forEach((config, ) => {
          console.log()
          addConfig(config);
          progressiveFadeIn(document.querySelectorAll('.configListEntry'),75, 'flex')
        });
      }
    })
    .catch((err) => console.log(err));
  //ADD CONFIG TO LIST
  const firstConfig = document.querySelector(".configListEntry");
  const onloadDevices = await fetch(`/config/${firstConfig.id}/devices`)
    .then((res) => {
      removeActive(document.getElementById(firstConfig.id));
      return res.json();
    })
    .catch((err) => console.log(err));

    if(onloadDevices.data.length > 0){
        onloadDevices.data.forEach((device) => {
        addDevice(device)
        progressiveFadeIn(document.querySelectorAll('.control'), 75, 'flex')
    }
    )}else{
        const noDeviceHTML = `<div class="emptyText">No Devices to show</div>`
        document.querySelector('.deviceContainer').insertAdjacentHTML('afterbegin', noDeviceHTML)
    }

  const entries = document.querySelectorAll(".configListEntry");
  entries.forEach((entry) => {
    entry.addEventListener("click", async (e) => {
     progressiveFadeOut(document.querySelectorAll('.control'), 30)
      removeActive(document.querySelector('.activeConfig'))    
      const target = e.target.closest(".configListEntry");
      const targetID = target.id;
      const devices = await fetch(`/config/${targetID}/devices`)
        .then((res) => {
          makeActive(target);
          return res.json();
        })
        .then(devices =>{
            devices.data.forEach(device => addDevice(device))
            progressiveFadeIn(document.querySelectorAll('.control'), 75, 'flex')
        })
        .catch((err) => console.log(err));
    });
    
  });
});
