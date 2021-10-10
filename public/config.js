const createNewConfig = document.querySelector(".createNewConfigBox");
console.log(createNewConfig);
const configInputSection = document.querySelector(".configInputSection");
createNewConfig.addEventListener("click", () => {
  fadeOut(createNewConfig, 200);
  setTimeout(() => {
    fadeIn(configInputSection, 250, "flex");
  }, 200);
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
