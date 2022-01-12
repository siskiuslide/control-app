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
    SOLISForm.action = "/users/signup";

    SOLISHeading.textContent = "Get Started Now";
    SOLISAltText.textContent = "Already have an account?";
    SOLISConfirm.forEach((el) => (el.style.display = "inline"));
    SOLISButton.textContent = "Sign Up";
    SOLISForm.style.transition = "transform 200ms";
    SOLISForm.style.transform = "translateY(0px)";
    SOLISButton.parentElement.style.transition = "transform 200ms";
    SOLISButton.parentElement.style.transform = "translateY(0px)";
    fadeOut(SOLISForm.querySelector(".forgotPassword"), 20);
  }
  if (SOLISState == "login") {
    SOLISForm.action = "/users/login";

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

SOLISButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const endpoint = SOLISForm.action;
  const creds = {};
  SOLISForm.querySelectorAll("input").forEach((el) => (creds[el.name] = el.value));
  const login = await fetch(endpoint, {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email: creds.email, password: creds.password, passwordConfirm: creds.passwordConfirm }),
  }).then((res) => res.json());

  console.log(login);
  if (login.status !== "success") {
    window.location.reload;
  } //prompt to try again -- will do this later
  const redirectPage = window.localStorage.getItem("mostRecentPage");
  window.location.replace(`${redirectPage}`);
});
