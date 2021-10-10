let fadeOut = function (element, duration) {
  element.style.transition = `opacity ease-out ${duration + "ms"}`;
  element.style.opacity = 0;
  setTimeout(() => {
    element.style.display = "none";
  }, (duration += 10));
};
let fadeIn = function (element, duration, orntn) {
  element.style.opacity = 0;
  element.style.display = `${orntn}`;
  element.style.transition = `opacity ease-in ${duration + "ms"}`;
  setTimeout(() => {
    element.style.opacity = 1;
  }, (duration += 10));
};

/////////////////////////

const listItems = document.querySelectorAll(".nav-item");
listItems.forEach((item, i) => {
  if (i != listItems.length - 1) {
    item.style.borderRight = "2px solid rgb(66,66,66)";
  }
  item.addEventListener("mouseout", () => {
    item.style.transition = "transform 1000ms";
  });
});
