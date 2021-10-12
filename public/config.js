const createNewConfig = document.querySelector(".createNewConfigBox");
const configInputSection = document.querySelector(".configInputSection");

createNewConfig.addEventListener("click", () => {
  fadeOut(createNewConfig, 160);
  setTimeout(() => {
    fadeIn(configInputSection, 220, "flex");
  }, 190);
});

const deleteConfigBtn = document.querySelector(".preConfigured-delete");

deleteConfigBtn.addEventListener("click", (e) => {
  const targetConfig = e.target.closest(".preConfiguredCard");
  const reqBody = { id: targetConfig.id };

  fetch(`/config`, {
    method: "delete",
    body: JSON.stringify(reqBody),
    headers: { "content-type": "application/json" },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
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
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(this);
  if (!configToggle.checked) {
    formData.type = "off";
  }
  console.log(formData);
  fetch(`127.0.0.1:5500/config`, {
    method: "post",
    body: formData,
  })
    .then((res) => {
      console.log("x");
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

configSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  form.submit();
});
const cancelForm = document.querySelector(".cancelBtn");
cancelForm.addEventListener("click", () => {
  fadeOut(configInputSection, 160);
  setTimeout(() => {
    fadeIn(createNewConfig, 220, "flex");
  }, 190);
});
