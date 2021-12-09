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
const headingContainer = document.querySelector(".aboutHeadingContainer");
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
    fadeIn(headingContainer, 150, "flex");
  })
    .then(
      setTimeout(() => {
        progressiveFadeIn(steps, 200, "flex");
      }, 600)
    )
    .then(
      setTimeout(() => {
        fadeInOpacOnly(scroll1, 1000, "block");
      }, 800)
    )
    .then(
      setTimeout(() => {
        fadeInOpacOnly(aboutBanner, 600);
      }, 1300)
    )
    .then(
      setTimeout(() => {
        fadeInOpacOnly(featuresSection, 600);
      }, 1500)
    )
    .then(
      setTimeout(() => {
        fadeInOpacOnly(linksSection, 600);
      }, 600)
    )
    
});

//scrolling
const findTarget = function(offY){
  const currentLoc = window.scrollY
  const currentOffset = currentLoc + offY + 350
  return currentOffset
}
const scrollDest = document.querySelectorAll(".scrollDest");
scrollDownBtns.forEach((btn, i) => {
  const id = btn.id.slice(6);
  const target = document.getElementById(`dest${id}`).getBoundingClientRect();
  const destination = findTarget(target.top)
  console.log(`Target: ${id}, toprect: ${target.top}, scrolldest: ${destination}`)
  btn.addEventListener("click", () => {
    window.scrollTo({ top: destination, left: 0, behavior: "smooth" });
  });
});

console.log(document.getElementById('dest2').getBoundingClientRect().top)