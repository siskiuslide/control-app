const steps = document.querySelectorAll(".step");
steps.forEach((step) => {
  const stepIcon = step.querySelector(".material-icons");
  step.addEventListener("mouseenter", () => {
    stepIcon.style.transform = "scale(1.1)";
  });
  step.addEventListener("mouseout", () => {
    stepIcon.style.transform = null;
  });
});

const mainHeading = document.querySelector(".openingImageHeading");
const aboutContainer = document.querySelector(".aboutContainer");
const aboutBanner = document.querySelector(".aboutBanner");
const featuresSection = document.querySelector(".featuresSection");
const linksSection = document.querySelector(".linksSection");
const scrollBtnContainer = document.querySelector(".arrowContainer");
const scrollDownBtns = document.querySelectorAll(".scrollDownBtn");
const scroll1 = document.getElementById("scroll1");
const scroll2 = document.getElementById("scroll2");

//chain of instructions to load elements when page is opened
window.addEventListener("load", () => {
  const stepFadeIn = new Promise(() => {
    fadeIn(mainHeading, 150, "block");
  })
    .then(
      setTimeout(() => {
        progressiveFadeIn(steps, 200, "flex");
      }, 600)
    )
    .then(
      setTimeout(() => {
        fadeIn(aboutContainer, 400, "flex");
      }, 600)
    )
    .then(
      setTimeout(() => {
        fadeIn(featuresSection, 600, "flex");
      }, 600)
    )
    .then(
      setTimeout(() => {
        fadeIn(linksSection, 600, "flex");
      }, 600)
    )
    .then(
      setTimeout(() => {
        fadeIn(scrollBtnContainer, 500, "block");
      }, 800)
    );
});

const scrollDest = document.querySelectorAll(".scrollDest");

scrollDownBtns.forEach((btn, i) => {
  const id = btn.id.slice(6);
  const target = document.getElementById(`dest${id}`).getBoundingClientRect();
  console.log(target);
  const destination = target.top - 40;
  console.log(destination);
  btn.addEventListener("click", () => {
    window.scrollTo({ top: destination, left: 0, behavior: "smooth" });
  });
});
