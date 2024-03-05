const videoSections = gsap.utils.toArray(".p-fl-item");
const videoWrappers = document.querySelectorAll(".video__wrapper");

Array.prototype.forEach.call(videoWrappers, (videoWrapper) => {
  const video = videoWrapper.querySelector("video");
  const overlay = videoWrapper.querySelector(".p-fl-video-overlay");
  videoWrapper.classList.add("play");
  overlay.addEventListener("click", () => {
    if (video.paused !== true) {
      video.pause();
      videoWrapper.classList.remove("play");
    } else {
      video.play();
      videoWrapper.classList.add("play");
    }
  });
});

Array.prototype.forEach.call(videoSections, (videoSection) => {
  const video = videoSection.querySelector("video");
  const videoWrapper = videoSection.querySelector(".p-fl-video-wrapper");
  const videoOverlay = videoSection.querySelector(".p-fl-video-overlay");
  videoWrapper.classList.add("play");

  gsap.to(videoSection, {
    scrollTrigger: {
      trigger: videoSection,
      //markers: true,
      start: "top bottom",
      end: "bottom top",
      onEnter: function (event) {
        if (video.paused == true) {
          video.play();
        } else {
          video.currentTime = 0;
          video.pause();
          video.play();
        }
        videoWrapper.classList.add("play");
      },
      onEnterBack: function (event) {
        if (video.paused == true) {
          video.play();
        } else {
          video.currentTime = 0;
          video.pause();
          video.play();
        }
        videoWrapper.classList.add("play");
      },
      onLeave: function (event) {
        video.pause();
        video.currentTime = 0;
        videoWrapper.classList.remove("play");
      },
      onLeaveBack: function (event) {
        video.pause();
        video.currentTime = 0;
        videoWrapper.classList.remove("play");
      },
    },
  });

  videoOverlay.addEventListener("click", () => {
    if (video.paused !== true) {
      video.pause();
      videoWrapper.classList.remove("play");
    } else {
      video.play();
      videoWrapper.classList.add("play");
    }
  });
});

function Dropdowns(options) {
  this.dropdownsDOM = document.querySelectorAll(options.selector);
  this.openFirst = options.openFirst;
  this.scrollToOpen = options.scrollToOpen;
  this.onlyOneOpened = options.onlyOneOpened;
  this.dropdowns = [];

  this.prepareDropdowns();
  this.attachEventHandlers();
}

Dropdowns.prototype.attachEventHandlers = function () {
  const self = this;

  this.dropdowns.forEach((dropdown) => {
    dropdown.toggle.addEventListener("click", (event) => {
      if (dropdown.opened) {
        dropdown.closeDropdown();
      } else {
        dropdown.openDropdown();
      }
      if (self.onlyOneOpened) {
        this.dropdowns.forEach((siblingDropdown) => {
          if (dropdown != siblingDropdown && siblingDropdown.opened)
            siblingDropdown.closeDropdown();
        });
      }

      if (self.scrollToOpen && dropdown.opened) {
        setTimeout(function () {
          dropdown.scrollToOpenDropdown();
        }, 550);
      }
    });

    dropdown.dropdownList.addEventListener("transitionend", () => {
      ScrollTrigger.refresh();
    });
  });
};

Dropdowns.prototype.prepareDropdowns = function () {
  this.dropdownsDOM.forEach((dropdown, index) => {
    if (this.openFirst && index == 0) {
      this.dropdowns.push(
        new Dropdown({
          element: dropdown,
          opened: true,
        })
      );
    } else {
      this.dropdowns.push(
        new Dropdown({
          element: dropdown,
          opened: false,
        })
      );
    }
  });
};

function Dropdown(options) {
  this.dropdown = options.element;
  this.opened = options.opened;
  this.toggle = this.dropdown.querySelector(".dd__toggle");
  this.dropdownList = this.dropdown.querySelector(".dd__list");
  this.dropdownContent = this.dropdown.querySelector(".dd__content");

  this.setInitialPosition();
  return this;
}

Dropdown.prototype.setInitialPosition = function () {
  if (this.opened) {
    this.openDropdown();
  } else {
    this.closeDropdown();
  }
};

Dropdown.prototype.scrollToOpenDropdown = function () {
  const topPos =
    this.dropdown.getBoundingClientRect().top + window.pageYOffset - 20;
  window.scrollTo({
    top: topPos, // scroll so that the element is at the top of the view
    behavior: "smooth", // smooth scroll
  });
};

Dropdown.prototype.closeDropdown = function () {
  this.dropdownList.style.height = 0;
  this.dropdownContent.style.opacity = 0;
  this.opened = 0;
  this.dropdown.classList.remove("is-open");
};

Dropdown.prototype.openDropdown = function () {
  this.dropdownList.style.height = this.dropdownContent.offsetHeight + "px";
  this.dropdownContent.style.opacity = 1;
  this.opened = 1;
  this.dropdown.classList.add("is-open");
};

function getTransitionEndEventName() {
  var transitions = {
    transition: "transitionend",
    OTransition: "oTransitionEnd",
    MozTransition: "transitionend",
    WebkitTransition: "webkitTransitionEnd",
  };
  let bodyStyle = document.body.style;
  for (let transition in transitions) {
    if (bodyStyle[transition] != undefined) {
      return transitions[transition];
    }
  }
}

const faqDropdowns = new Dropdowns({
  selector: ".faq__item",
  openFirst: 0,
  scrollToOpen: 0,
  onlyOneOpened: 1,
});

const specsDropdowns = new Dropdowns({
  selector: ".r-specs__dd",
  openFirst: 1,
  scrollToOpen: 0,
  onlyOneOpened: 1,
});
