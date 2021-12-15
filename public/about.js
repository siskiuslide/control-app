const steps = document.querySelectorAll(".step");
const stepContainer = document.querySelector(".stepFlexContainer");
steps.forEach((step) => {
  if (step.classList.contains("neonLight")) {
    step.addEventListener("mouseenter", () => {
      step.style.background = "";
    });
  }
  const stepIcon = step.querySelector(".material-icons");
  step.addEventListener("mouseenter", () => {
    stepIcon.style.transform = "scale(1.1)";
  });
  step.addEventListener("mouseout", () => {
    stepIcon.style.transform = null;
  });
});
const homeBody = document.querySelector(".homeBody");
const mainHeading = document.querySelector(".openingImageHeading");
const headingContainer = document.querySelector(".aboutHeadingContainer");
const demoFlex = document.querySelector(".demoControlsFlex");
const demoControls = document.querySelectorAll(".demoControl");
const aboutBanner = document.querySelector(".aboutBanner");
const aboutChildNodes = Array.from(aboutBanner.children);

const largeFooter = document.querySelector(".largeFooter");
const linksSection = document.querySelector(".linksSection");
const scrollBtnContainer = document.querySelector(".arrowContainer");
const scrollDownBtns = document.querySelectorAll(".scrollDownBtn");
const scroll1 = document.getElementById("scroll1");
const scroll2 = document.getElementById("scroll2");

const interactiveBtn = document.querySelector(".tryMeContainer");

//chain of instructions to load elements when page is opened
window.addEventListener("load", () => {
  const stepFadeIn = new Promise(() => {
    fadeIn(headingContainer, 150, "flex");
    fadeIn(stepContainer, 600, "flex");
    fadeIn(demoFlex, 600, "flex");
  })
    .then(
      setTimeout(() => {
        progressiveFadeIn(demoControls, 200, "flex");
        progressiveFadeIn(steps, 200, "flex");
      }, 600)
    )
    .then(
      setTimeout(() => {
        fadeInOpacOnly(scroll1, 1000);
        fadeInOpacOnly(interactiveBtn, 500);
      }, 1000)
    );
});

//scrolling
const findTarget = function (offY) {
  const currentLoc = window.scrollY;
  const targetOffset = currentLoc + offY;
  return targetOffset;
};
const scrollDest = document.querySelectorAll(".scrollDest");
scrollDownBtns.forEach((btn) => {
  const id = btn.id.slice(6);
  const target = document.getElementById(`dest${id}`).getBoundingClientRect();
  const destination = findTarget(target.top) + 450;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: destination, behavior: "smooth" });
  });
});

// const demoControls = document.querySelectorAll('.demoControl')
demoControls.forEach((control) => {
  const btn = control.querySelector(".controlStatusIconCont");
  control.addEventListener("click", (e) => {
    if (e.target.closest(".demoControl").id == "demoControl2") {
      const neonTargets = document.querySelectorAll(".neonTarget");
      btn.classList.toggle("device-on");
      btn.classList.toggle("device-off");
      neonTargets.forEach((target) => {
        target.style.transition = "all 100ms";
        target.classList.toggle("neonLights");
      });
    }
    if (e.target.closest(".demoControl").id == "demoControl1") {
      btn.classList.toggle("device-on");
      btn.classList.toggle("device-off");
      aboutBanner.classList.toggle("aboutBannerGray");
    }
  });
});

//features section
const featuresSection = document.querySelector(".featuresSection");
const features = Array.from(document.querySelectorAll(".feature"));
console.log(features);
const featBtn = document.querySelectorAll(".featBtn");

const changeFeatState = function (feat) {
  feat.classList.toggle("inactiveFeature");
  feat.classList.toggle("activeFeature");
};
featBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const current = features.find((el) => el.classList.contains("activeFeature"));
    const currentIndex = features.findIndex((el) => el.classList.contains("activeFeature"));
    current.classList.toggle("activeFeature");
    current.classList.toggle("inactiveFeature");
    if (btn.classList.contains("featNextBtn")) {
      const nextFeat = currentIndex + 1;
      nextFeat < features.length - 1 ? applyActive(features[nextFeat]) : applyActive(features[0]);
    }
    if (btn.classList.contains("featPrevBtn")) {
      const prevFeat = currentIndex - 1;
      prevFeat > 0 ? applyActive(features[prevFeat]) : applyActive(features[features.length - 1]);
    }
  });
});
// const featNext = document.querySelectorAll(".featNextBtn");
// const featPrev = document.querySelectorAll(".featPrevBtn");

//SOLIS//
const SOLIS = document.querySelector(".SOLIS");
const SOLISAltText = document.querySelector(".altLink");
const SOLISForm = document.querySelector(".solisItem");
const SOLISHeading = SOLISForm.querySelector("h2");
const SOLISConfirm = document.querySelectorAll(".solisConfirm");
const SOLISButton = SOLISForm.querySelector(".button");
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

// //links section
// const newTabLinks = document.querySelectorAll('.newTabLink')
// newTabLinks.forEach(link=>{
//   link.addEventListener('click',()=>{
//     window.open(link.href, "_blank")
//   })
// })

const elementAfterMain = [...aboutChildNodes, featuresSection, ...features, largeFooter, SOLIS, linksSection];
const fadeInThreshold = window.innerHeight - 300;
class Fadeable {
  constructor(element) {
    this.element = element;
    this.offset = this.findOffset(this.element);
    this.nodeType = element;
    this.inViewPortTransition = function (offset) {
      if (offset <= fadeInThreshold && element.style.opacity !== "1") {
        //divs are all flex elements, others tend not to be
        this.nodeType == "DIV" ? fadeIn(element, 840, "flex") : fadeInOpacOnly(element, 840);
      }
    };
  }
  findOffset = function (element) {
    const rect = element.getBoundingClientRect();
    const offset = rect.top;
    return rect.top;
  };
}
const fadeablesArr = [];
elementAfterMain.forEach((el) => {
  return fadeablesArr.push(new Fadeable(el));
});

window.addEventListener("scroll", () => {
  fadeablesArr.forEach((el) => {
    el.inViewPortTransition(el.findOffset(el.element));
  });
});
