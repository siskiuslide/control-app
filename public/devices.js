//inserting dynamic elements
const addConfig = function (config) {
  const configListContainer = document.querySelector(".configListContainer");
  let configEntryHTML = `<div class="configListItem configListEntry inactiveConfig" id="${config._id}">
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
      <div class="controlFooterItem"><span class="material-icons control-chevron-icon">chevron_right</span>
      </div>
  </div>
</div>`;
  deviceContainer.insertAdjacentHTML("afterbegin", deviceHTML);
};

//list entry functions
const activeToggle = function (entry) {
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
      activeToggle(document.getElementById(firstConfig.id));
      addDevice(device);
      progressiveFadeIn(document.querySelectorAll(".control"), 75, "flex");
    });
  }else{
    document.querySelector('.deviceListContainer').insertAdjacentHTML('afterbegin', emptyText)
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
      const targetURL = `/config/${targetID}/devices`
      const devices = await fetch(targetURL)
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

  //polling
  let interval;
  const pollSwitchBtn = document.querySelector('.pollSwitch')
  pollSwitchBtn.addEventListener('click', ()=>{
    pollSwitchBtn.classList.toggle('pollOn')
    pollSwitchBtn.classList.toggle('pollOff')
    if(pollSwitchBtn.classList.contains('pollOn')){
      pollSwitchBtn.textContent='timer'
      //poll for the device state and compare.
      //wait 3s for the page to load fully then at every 1.5s interval make a request.             
        interval = setInterval(async ()=>{
          document.visibilityState === 'visible' ? visible = true : visible = false;
          if(visible === true){
            const pollRes = await pollDevices(document.querySelector('.activeConfig'))
            comparePollDevices(pollRes.data)
          }
        }, 1500)
      return interval
    }else if(pollSwitchBtn.classList.contains('pollOff')){
      pollSwitchBtn.textContent='timer_off'
      clearInterval(interval)
    }
  })




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

      //STATE CHANGE
      //get new state & set the style instantly
      const stateChangeButton = control.querySelector(".controlStatusIconCont");
      //the classname of what we want to set it to.
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
        setStatusStyle(control)
        // button.classList.toggle("device-on");
        // button.classList.toggle("device-off");
      }
    });
  });

});

