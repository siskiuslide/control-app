// const emptyText = `<div class="emptyText">None to show :/</div>`;

const createNewConfig = document.querySelector(".createNewConfigBox");
const configInputSection = document.querySelector(".configInputSection");

////
//PRECONFIG CARDS
////
let configType, favouriteContent, favouriteClass;
//uses 'on'/'off' because that is the default for checkboxes
const checkType = (config) => {
  config.type == "on" ? (configType = "Cloud") : (configType = "Local");
  return configType;
};

const preConfiguredCardSection = document.querySelector(".preConfiguredSection");
const addCard = function (config) {
  const type = checkType(config);
  const date = new Date(config.updatedAt);
  const configCard = `
  <div class="preConfiguredCard" id="${config._id}" data-slug="${config.slug}">
    <div class="pcHeaderWrapper">
      <div class="preConfiguredHeaderBox">
        <div class="pcHeaderBox-item preConfiguredTitle">${config.name}</div>
        <div class="pcHeaderBox-item preConfiguredUpdate">${date.getHours()}:${date.getMinutes()} | ${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}</div>
          <div class="pcHeaderBox-item preConfiguredIconsSection">
          <div class="preConfiguredIcon preConfigured-settings">
            <span class="material-icons refresh-icon" id="preConfiguredIcon">refresh</span>
          </div>
          <div class="preConfiguredIcon preConfigured-edit">
            <span class="material-icons edit-icon" id="preConfiguredIcon" href="/configView.html">edit</span>
          </div>
          <div class="preConfiguredIcon preConfigured-settings">
            <span class="material-icons settings-icon" id="preConfiguredIcon" href='/configView.html'>settings</span>
          </div>
          <div class="preConfiguredIcon preConfigured-favourite">
            <span class="material-icons favourite-icon ${setFavIconStyle(
              config
            )}" id="preConfigured-favourite">${setFavIcon(config)}</span>
          </div>
          <div class="preConfiguredIcon preConfigured-delete">
            <span class="material-icons delete-icon" id="preConfigured-delete">delete</span>
          </div>
        </div>
      </div>
    </div>
    <div class="preConfiguredBody">
      <div class="split-section pcDetails">
        <div class="detail-flex">
          <div class="detailIcon">
            <span class="material-icons cloudIcon">cloud</span>
          </div>
          <div class="detailField">Type</div>
          <div class="detailText typeText">${checkType(config)}</div>              
        </div>
        <div class="detail-flex">
          <div class="detailIcon">
            <span class="material-icons timerIcon">timer</span>
          </div>
          <div class="detailField">Polling</div>
          <div class="detailText pollingSettingText">${config.polling.charAt(0).toUpperCase()}${config.polling.slice(
    1
  )}</div>              
        </div>
        <div class="detail-flex">
          <div class="detailIcon">
            <span class="material-icons tagIcon">tag</span>
          </div>
          <div class="detailField">App ID</div>
          <div class="detailText appIDText">${config.appID}</div>              
        </div>
      </div>
      <a href="/devices.html">
      <div class="split-section pc-right-split">
        <div class="right-split-item devicesButton" href="/devices.html">
        <div class="deviceCount-item deviceCountText">
         <div class="deviceCount-results">Devices</div>
          <div class="deviceCount-chevron">
            <span class="material-icons chevron-icon">chevron_right</span>
          </div>
          </div>
         </div>
        </a>
      </div>   
    </div>          
  </div>
</div>
</div>`;
  preConfiguredCardSection.insertAdjacentHTML("beforeEnd", configCard);
  progressiveFadeIn(document.querySelectorAll(".preConfiguredCard"), 45, "inline");
};
//DISPLAY ON LOAD
window.addEventListener("load", async () => {
  progressiveFadeOut(document.querySelectorAll(".preConfiguredCard"), 00);

  const rawConfigData = await fetch("/config", {
    headers: {
      credentials: "include",
    },
    method: "GET",
  }).then((res) => res.json());

  if (rawConfigData.status !== "success") {
    window.location.replace("http://127.0.0.1:5500/portal.html");
  }

  const configData = rawConfigData.body;
  if (configData.length == 0) {
    throwError(".preConfiguredSection", "beforeend", "No networks to show", "noConfigCardError");
  }
  configData.forEach((config) => {
    addCard(config);
  });
  fadeIn(createNewConfig, 100, "flex");
});

preConfiguredCardSection.addEventListener("click", async (e) => {
  //DELETE
  if (e.target.classList.contains("delete-icon")) {
    const targetConfig = e.target.closest(".preConfiguredCard");
    const reqBody = { id: targetConfig.id };
    await fetch(`/config`, {
      method: "delete",
      body: JSON.stringify(reqBody),
      headers: { "content-type": "application/json" },
    })
      .then((response) => {
        fadeOut(targetConfig, 180);
        setTimeout(() => {
          preConfiguredCardSection.removeChild(document.getElementById(`${targetConfig.id}`));
        }, 200);
      })
      .catch((err) => {
        console.log(err);
      });
    if (document.querySelector(".preConfiguredCard") == null) {
      preConfiguredCardSection.insertAdjacentHTML("beforeend", emptyText);
      throwError(".preConfiguredSection", "beforeend", "No networks to show", "noConfigCardError");
    }
  }
  //FAVOURITE
  if (e.target.classList.contains("favourite-icon")) {
    const configEl = e.target.closest(".preConfiguredCard");
    const currentFavState = checkCurrentFavState(configEl);
    const newFavState = getNewFavState(currentFavState);
    const updateObj = favouriteObj("config", configEl, newFavState);
    updateFavStyle(e.target, newFavState);

    await fetch("/config", {
      method: "PATCH",
      body: JSON.stringify(updateObj),
      headers: { "content-type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
  }

  ////REFRESH
  if (e.target.classList.contains("refresh-icon")) {
    const target = e.target.closest(".preConfiguredCard");
    const targetID = target.id;
    const response = await fetch(`/config/${target.id}`)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    const responseData = response.data.find((el) => el._id === targetID);

    if (responseData) {
      const updateCard = document.getElementById(`${targetID}`);
      updateCard.querySelector(".typeText").textContent = checkType(responseData);
      updateCard.querySelector(".targetText").textContent = responseData.target;
      updateCard.querySelector(".APIKeyText").textContent = responseData.APIKey;
      updateCard.querySelector(".AppIDText").textContent = responseData.appID;
      const count = await getDevice(e);
      document.querySelector(".deviceCountNumber").textContent = count.data.length;
      if (responseData.favourite == true) {
        updateCard.querySelector(".favourite-icon").classList.add("favourited");
        updateCard.querySelector(".favourite-icon").textContent = "star";
      }
    } else {
      alert("Unable to update data");
    }
  }
});

createNewConfig.addEventListener("click", () => {
  fadeOut(createNewConfig, 160);
  setTimeout(() => {
    fadeIn(configInputSection, 220, "flex");
  }, 190);
});

//////////
///FORM///
//////////

const toggleHeading = function (e, heading, checkedText, uncheckedText) {
  if (e.target.checked) {
    heading.textContent = checkedText;
  } else {
    heading.textContent = uncheckedText;
  }
};

const configToggle = document.querySelector(".configToggle");
let inputTargetHeader = document.querySelector(".headerTarget");

configToggle.addEventListener("change", (e) => {
  toggleHeading(e, inputTargetHeader, "Cloud Address", "Hub Address");
});

const configSubmitBtn = document.querySelector(".submitBtn");
const form = document.querySelector(".configForm");
configSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  form.submit();
  form.reset();

  window.location.reload();
});

const cancelForm = document.querySelector(".cancelBtn");
cancelForm.addEventListener("click", () => {
  fadeOut(configInputSection, 160);
  setTimeout(() => {
    fadeIn(createNewConfig, 220, "flex");
  }, 190);
});

const colourInput = document.querySelector(".inputConfigColour");
colourInput.defaultValue = "#0082bee";
colourInput.value = "#0082bee";
