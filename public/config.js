const emptyText = `<div class="emptyText">None to show :/</div>`;

const createNewConfig = document.querySelector(".createNewConfigBox");
const configInputSection = document.querySelector(".configInputSection");

//add pre-config card
const preConfiguredCardSection = document.querySelector(".preConfiguredSection");
const addCard = function (config) {
  let configType;
  config.type == "on" ? (configType = "Cloud") : (configType = "Local");
  const configCard = `
  <div class="preConfiguredCard" id="${config._id}">
    <div class="pcHeaderWrapper">
      <div class="preConfiguredHeaderBox">
        <div class="preConfiguredTitle">${config.name}</div>
          <div class="preConfiguredIconsSection">
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
            <span class="material-icons favourite-icon" id="preConfigured-favourite">star_outline</span>
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
          <div class="detailText">${configType}</div>              
        </div>
        <div class="detail-flex">
          <div class="detailIcon">
           <span class="material-icons locationIcon">fmd_good</span>
          </div>
          <div class="detailField">Address</div>
          <div class="detailText detailText-small">${config.target}</div>              
        </div>
        <div class="detail-flex">
          <div class="detailIcon">
            <span class="material-icons lockIcon">lock</span>
          </div>
          <div class="detailField">API Key</div>
          <div class="detailText detailText-small">${config.APIKey}</div>              
        </div>
        <div class="detail-flex">
          <div class="detailIcon">
            <span class="material-icons tagIcon">tag</span>
          </div>
          <div class="detailField">App ID</div>
          <div class="detailText">${config.appID}</div>              
        </div>
      </div>
      <div class="split-section pc-right-split">
        <div class="right-split-item deviceCountContainer">
          <div class="deviceCount-item deviceCountNumber">COUNT</div>
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
  // const rawDeviceLength = await fetch(``)

  if (configData.length == 0) {
    return preConfiguredCardSection.insertAdjacentHTML("beforeend", emptyText);
  }
  configData.forEach((config) => {
    addCard(config);
  });
});

//DELETE
preConfiguredCardSection.addEventListener("click", async (e) => {
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
  if(e.target.classList.contains('favourite-icon')){
    console.log(e.target)
    e.target.classList.toggle('favourited')
    if(e.target.classList.contains('favourited')){
      e.target.textContent = 'star'
    }else {
      e.target.textContent = 'star_outline'
    }
  }
});

createNewConfig.addEventListener("click", () => {
  fadeOut(createNewConfig, 160);
  setTimeout(() => {
    fadeIn(configInputSection, 220, "flex");
  }, 190);
});

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
