const createNewConfig = document.querySelector(".createNewConfigBox");
console.log(createNewConfig);
const configInputSection = document.querySelector(".configInputSection");

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
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(this);
  if(!configToggle.checked){
    formData.type = 'off'
  }
  console.log(formData);
  fetch("127.0.0.1:5500/config", {
    method: "post",
    body: formData,
  }).then((res) => console.log(res));
});

configSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  form.submit();
});
const cancelForm = document.querySelector('.cancelBtn')
cancelForm.addEventListener('click', ()=>{
  fadeOut(configInputSection, 160)
  setTimeout(()=>{
    fadeIn(createNewConfig, 220, 'flex')
  }, 190)
})
