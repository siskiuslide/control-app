const emptyText = `<div class="emptyText">None to show :/</div>`;

const createNewConfig = document.querySelector(".createNewConfigBox");
const configInputSection = document.querySelector(".configInputSection");

////
//PRECONFIG CARDS
////
let configType, favouriteContent, favouriteClass;

const checkType = (config) => {
  config.type == "on" ? (configType = "Cloud") : (configType = "Local");
  return configType;
};

const setFavouriteIcon = (config) => {
  config.favourite == true ? (favouriteContent = "star") : (favouriteContent = "star_outline");
  return favouriteContent;
};
const setFavouriteIconStyle = (config) => {
  config.favourite == true ? (favouriteClass = "favourited") : (favouriteClass = "");
  return favouriteClass;
};

const preConfiguredCardSection = document.querySelector(".preConfiguredSection");
const addCard = function (config) {
  const type = checkType(config);
  const date = new Date(config.lastUpdated);
  const configCard = `
  <div class="preConfiguredCard" id="${config._id}">
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
            <span class="material-icons favourite-icon ${setFavouriteIconStyle(
              config
            )}" id="preConfigured-favourite">${setFavouriteIcon(config)}</span>
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
           <span class="material-icons locationIcon">fmd_good</span>
          </div>
          <div class="detailField">Address</div>
          <div class="detailText detailText-small targetText">${config.target}</div>              
        </div>
        <div class="detail-flex">
          <div class="detailIcon">
            <span class="material-icons lockIcon">lock</span>
          </div>
          <div class="detailField">API Key</div>
          <div class="detailText detailText-small APIKeyText">${config.APIKey}</div>              
        </div>
        <div class="detail-flex">
          <div class="detailIcon">
            <span class="material-icons tagIcon">tag</span>
          </div>
          <div class="detailField">App ID</div>
          <div class="detailText appIDText">${config.appID}</div>              
        </div>
      </div>
      <div class="split-section pc-right-split">
        <div class="right-split-item deviceCountContainer" href="/config/${config._id}/devices">
          <div class="deviceCount-item deviceCountNumber">Count</div>
        <div class="deviceCount-item deviceCountText">
          <div class="deviceCount-results">Results</div>
          <div class="deviceCount-chevron">
            <span class="material-icons chevron-icon">chevron_right</span>
          </div>
        </div>
        </div>
      </div>   
    </div>          
  </div>
</div>`;
  preConfiguredCardSection.insertAdjacentHTML("beforeEnd", configCard);
  setTimeout(() => {
    document.querySelectorAll(".preConfiguredCard").forEach((card) => (card.style.opacity = "1"));
  }, 100);
};
//DISPLAY ON LOAD
window.addEventListener("load", async () => {
  const rawConfigData = await fetch("/config").then((res) => res.json());
  const configData = rawConfigData.body;
  console.log(configData);
  // const rawDeviceLength = await fetch(``)

  if (configData.length == 0) {
    return preConfiguredCardSection.insertAdjacentHTML("beforeend", emptyText);
  }
  configData.forEach((config) => {
    addCard(config);
  });
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
    }
  }
  //FAVOURITE
  if (e.target.classList.contains("favourite-icon")) {
    e.target.classList.toggle("favourited");
    const targetConfig = e.target.closest(".preConfiguredCard");
    let favouriteStatus;
    if (e.target.classList.contains("favourited")) {
      e.target.textContent = "star";
      favouriteStatus = true;
    } else {
      e.target.textContent = "star_outline";
      favouriteStatus = false;
    }

    const favouriteUpdate = {
      _id: targetConfig.id,
      favourite: favouriteStatus,
    };
    await fetch("/config", {
      method: "PATCH",
      body: JSON.stringify(favouriteUpdate),
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

  ////REFRESH
  if (e.target.classList.contains("refresh-icon")) {
    const target = e.target.closest(".preConfiguredCard");
    const targetID = target.id;
    const response = await fetch(`/config/${target.id}`)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((err) => console.log(err));
    const responseData = response.data.find((el) => el._id === targetID);

    if (responseData) {
      const updateCard = document.getElementById(`${targetID}`);
      updateCard.querySelector(".typeText").textContent = checkType(responseData);
      updateCard.querySelector(".targetText").textContent = responseData.target;
      updateCard.querySelector(".APIKeyText").textContent = responseData.APIKey;
      updateCard.querySelector(".AppIDText").textContent = responseData.appID;
      if (responseData.favourite == true) {
        updateCard.querySelector(".favourite-icon").classList.add("favourited");
        updateCard.querySelector(".favourite-icon").textContent = "star";
      }
    } else {
      alert("Unable to update data");
    }
  }

  //COUNTButton - ON CLICK make device request

  if (e.target.classList.contains("deviceCountContainer")) {
    const config = e.target.closest(".preConfiguredCard").id;
    console.log(config);
    const data = await fetch(`/config/${config}/devices`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => console.log(err));
    console.log(data);
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

const configToggle = document.querySelector(".configToggle");
let inputTargetHeader = document.querySelector(".headerTarget");
let localOrCloud = document.querySelector(".localOrCloud");

configToggle.addEventListener("change", (e) => {
  if (e.target.checked) {
    inputTargetHeader.textContent = "Cloud Address";
  } else {
    inputTargetHeader.textContent = "Hub address";
  }
});

const configSubmitBtn = document.querySelector(".submitBtn");
const form = document.querySelector(".configForm");
configSubmitBtn.addEventListener("click", (e) => {
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
