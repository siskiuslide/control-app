const steps = document.querySelectorAll(".step");
const stepContainer = document.querySelector('.stepFlexContainer')
steps.forEach((step) => {
  if(step.classList.contains('neonLight')){
    step.addEventListener('mouseenter',()=>{
      step.style.background = '';
    })
  }
  const stepIcon = step.querySelector(".material-icons");
  step.addEventListener("mouseenter", () => {
    stepIcon.style.transform = "scale(1.1)";
  });
  step.addEventListener("mouseout", () => {
    stepIcon.style.transform = null;
  });
});
const homeBody = document.querySelector('.homeBody')
const mainHeading = document.querySelector(".openingImageHeading");
const headingContainer = document.querySelector(".aboutHeadingContainer");
const demoFlex = document.querySelector('.demoControlsFlex')
const demoControls = document.querySelectorAll('.demoControl')
const aboutBanner = document.querySelector(".aboutBanner");
const featuresSection = document.querySelector(".featuresSection");
const linksSection = document.querySelector(".linksSection");
const scrollBtnContainer = document.querySelector(".arrowContainer");
const scrollDownBtns = document.querySelectorAll(".scrollDownBtn");
const scroll1 = document.getElementById("scroll1");
const scroll2 = document.getElementById("scroll2");

const interactiveBtn = document.querySelector('.tryMeContainer')

//chain of instructions to load elements when page is opened
window.addEventListener("load", () => {
  const stepFadeIn = new Promise(() => {
    fadeIn(headingContainer, 150, "flex");
    fadeIn(stepContainer, 600, 'flex'); 
    fadeIn(demoFlex, 600, "flex");
  })
  .then(
    setTimeout(() => {
      progressiveFadeIn(demoControls, 200, "flex");
      progressiveFadeIn(steps, 200, 'flex')
    }, 600)
  )
    .then(
      setTimeout(() => {
        fadeInOpacOnly(scroll1, 1000);
        fadeInOpacOnly(interactiveBtn, 500)
      }, 1000)
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
  const targetOffset = currentLoc + offY
  return targetOffset
}
const scrollDest = document.querySelectorAll(".scrollDest");
scrollDownBtns.forEach((btn) => {
  const id = btn.id.slice(6);
  const target = document.getElementById(`dest${id}`).getBoundingClientRect();
  const destination = findTarget(target.top) + 475
  btn.addEventListener("click", () => {
    window.scrollTo({top: destination, behavior: "smooth" });
  });
});



// const demoControls = document.querySelectorAll('.demoControl')
demoControls.forEach(control=>{
  const btn = control.querySelector('.controlStatusIconCont')
  control.addEventListener('click',(e)=>{
    if(e.target.closest('.demoControl').id == 'demoControl2'){
      const neonTargets = document.querySelectorAll('.neonTarget')
      btn.classList.toggle('device-on')
      btn.classList.toggle('device-off')
      neonTargets.forEach(target=>{
        target.style.transition = "all 100ms"
        target.classList.toggle('neonLights')
      })
    }
  })
})
