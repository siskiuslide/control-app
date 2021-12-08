const steps = document.querySelectorAll(".step");
steps.forEach((step) => {
  const stepIcon = step.querySelector(".material-icons");
  console.log(stepIcon);
  step.addEventListener("mouseenter", () => {
    stepIcon.style.transform = "scale(1.1)";
  });
  step.addEventListener("mouseout", () => {
    stepIcon.style.transform = null;
  });
});

const mainHeading = document.querySelector(".openingImageHeading");
const aboutContainer = document.querySelector(".aboutContainer");
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
    );
});
