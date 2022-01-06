//SOLIS//
const SOLIS = document.querySelector(".SOLIS");
const SOLISAltText = document.querySelector(".altLink");
const SOLISForm = document.querySelector(".solisItem");
const SOLISHeading = SOLISForm.querySelector("h2");
const SOLISConfirm = document.querySelectorAll(".solisConfirm");
const SOLISButton = SOLISForm.querySelector(".button");
const SOLISChildNodes = Array.from(SOLISForm.children);
let SOLISState;
SOLIS.classList.contains("signUp") ? (SOLISState = "signUp") : (SOLISState = "login");
SOLISAltText.addEventListener("click", (e) => {
  e.preventDefault();
  // SOLISAltText.style.color = "rgb(71,64,64)";
  SOLISForm.classList.toggle("signUp");
  SOLISForm.classList.toggle("login");
  SOLISForm.classList.contains("signUp") ? (SOLISState = "signUp") : (SOLISState = "login");

  if (SOLISState == "signUp") {
    SOLISHeading.textContent = "Get Started Now";
    SOLISAltText.textContent = "Already have an account?";
    SOLISConfirm.forEach((el) => (el.style.display = "inline"));
    SOLISButton.textContent = "Sign Up";
    SOLISForm.style.transition = "transform 200ms";
    SOLISForm.style.transform = "translateY(0px)";
    SOLISButton.parentElement.style.transition = "transform 200ms";
    SOLISButton.parentElement.style.transform = "translateY(0px)";
    fadeOut(SOLISForm.querySelector(".forgotPassword"), 00);
  }
  if (SOLISState == "login") {
    SOLISForm.style.height;
    SOLISHeading.textContent = "Login";
    SOLISAltText.textContent = "Create an account";
    SOLISConfirm.forEach((el) => (el.style.display = "none"));
    SOLISButton.textContent = "Login";
    SOLISForm.style.transition = "transform 200ms";
    SOLISForm.style.transform = "translateY(30px)";
    SOLISButton.parentElement.style.transition = "transform 300ms";
    SOLISButton.parentElement.style.transform = "translateY(-30px)";
    fadeIn(SOLISForm.querySelector(".forgotPassword"), 150, "inline");
  }
});