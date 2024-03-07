function updateVisibilityOfDiv(form) {
  const div = form.querySelector('[ms-code-file-upload-input="files"]');
  if (div) {
    div.style.display = form.selectedFiles.length > 0 ? "block" : "none";
  }
}

const forms = document.querySelectorAll('form[ms-code-file-upload="form"]');
let currentDeleteIndex = -1;

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
let isCheckingInputs = false;

forms.forEach((form) => {
  form.setAttribute("enctype", "multipart/form-data");
  form.selectedFiles = [];
  const uploadInputs = form.querySelectorAll("[ms-code-file-upload-input]");

  uploadInputs.forEach((uploadInput) => {
    const inputName = uploadInput.getAttribute("ms-code-file-upload-input");
    const previewsContainer = document.createElement("div");
    previewsContainer.classList.add("previews-container");
    const button = document.getElementById("uploadButton");

    const updateButtonStatus = () => {
      button.classList.toggle(
        "photo-btn-gh-disabled",
        form.selectedFiles.length >= 4
      );
      const maxAmountPhotoNotification = document.getElementById(
        "maxAmountPhotoNotification"
      );
      if (maxAmountPhotoNotification) {
        maxAmountPhotoNotification.classList.toggle(
          "visible",
          form.selectedFiles.length >= 4
        );
      }
    };

    const updatePreviews = () => {
      previewsContainer.innerHTML = "";
      form.selectedFiles.forEach((file, index) => {
        const previewWrapper = document.createElement("div");
        previewWrapper.classList.add("preview-wrapper");
        const preview = document.createElement("img");
        const removeButton = document.createElement("div");
        removeButton.classList.add("close-icon-wrapper");

        removeButton.addEventListener("click", (event) => {
          event.stopPropagation();
          form.selectedFiles.splice(index, 1);
          updatePreviews();
        });

        previewWrapper.addEventListener("click", () => {
          openSheet(() => {
            form.selectedFiles.splice(index, 1);
            updatePreviews();
          }, index);
        });

        const reader = new FileReader();
        reader.onload = (e) => {
          preview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        previewWrapper.appendChild(preview);
        previewWrapper.appendChild(removeButton);
        previewsContainer.appendChild(previewWrapper);
      });
      updateButtonStatus();
      updateVisibilityOfDiv(form);
    };

    if (button) {
      fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute("name", inputName + "[]");
      fileInput.setAttribute("accept", "image/*");
      fileInput.setAttribute("multiple", "");
      fileInput.style.display = "none";
      fileInput.setAttribute("id", "collectFileInput");
      form.appendChild(fileInput);

      button.addEventListener("click", (event) => {
        event.preventDefault();
        fileInput.value = "";
        fileInput.click();
      });

      fileInput.addEventListener("change", () => {
        const maxSizeInBytes = 5 * 1024 * 1024;

        if (form.selectedFiles.length + fileInput.files.length > 4) {
          alert("Maximum of 4 photos.");
        } else {
          Array.from(fileInput.files).forEach((file) => {
            if (file.size > maxSizeInBytes) {
              alert("Maximum photo size: 5 mb.");
            } else {
              form.selectedFiles.push(file);
            }
          });
          updatePreviews();
        }
      });
    }
    uploadInput.appendChild(previewsContainer);
  });
});

function openSheet(deleteCallback, index) {
  currentDeleteIndex = index;
  document.querySelector(".btnDelete").onclick = function () {
    deleteCallback();
    closeSheet();
  };
  document.getElementById("action-sheet").classList.add("action-sheet-visible");
  document.getElementById("mask").classList.add("mask-visible");
  document.body.classList.add("body-no-scroll");
  const form = forms[currentDeleteIndex];
  if (form) {
    updateVisibilityOfDiv(form);
  }
}

function closeSheet() {
  document
    .getElementById("action-sheet")
    .classList.remove("action-sheet-visible");
  document.getElementById("mask").classList.remove("mask-visible");
  document.body.classList.remove("body-no-scroll");
  if (currentDeleteIndex !== -1 && currentDeleteIndex < forms.length) {
    const form = forms[currentDeleteIndex];
    if (form) {
      updateVisibilityOfDiv(form);
    }
  }
}
const element = document.querySelector(
  ".gfg-action.action-sheet-mask.extraMask"
);
if (element) {
  element.addEventListener("click", closeSheet);
}

window.addEventListener("scroll", function () {
  var header = document.getElementById("toolbar-wrap");
  if (window.pageYOffset > 1) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

document.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("email-form");
  if (form) {
    form.setAttribute("novalidate", "");
  }
});

const form = document.getElementById("email2-form");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const submitButton = document.getElementById("form-button");
const emailErrorElement = document.getElementById("emailError");
const messageErrorElement = document.getElementById("messageError");

function checkInputs() {
  if (messageInput) {
    let isMessageValid = validateMessage();
  }
  let isEmailValid = isEmailTouched && validateEmail();
  let isValid = isEmailValid && isMessageValid;

  submitButton.disabled = !isValid;
  submitButton.classList.toggle("btn-gh-active", isValid);
  return isValid;
}

function validateEmail() {
  let isValid = false;
  if (emailInput.value.trim() === "") {
    emailErrorElement.textContent = "This field is required";
    emailErrorElement.classList.add("visible");
    emailInput.classList.add("input-not-valid");
    isValid = false;
  } else if (!emailRegex.test(emailInput.value)) {
    emailErrorElement.textContent = "Enter a valid email address";
    emailErrorElement.classList.add("visible");
    emailInput.classList.add("input-not-valid");
    isValid = false;
  } else {
    emailErrorElement.classList.remove("visible");
    emailInput.classList.remove("input-not-valid");
    isValid = true;
  }
  return isValid;
}

function validateMessage() {
  let messageValue = messageInput.value.trim();
  let isValid = messageInput.value.trim() !== "";

  if (isValid) {
    messageErrorElement.classList.remove("visible");
    messageInput.classList.remove("input-not-valid");
  } else if (isMessageTouched) {
    messageErrorElement.classList.add("visible");
    messageInput.classList.add("input-not-valid");
    messageErrorElement.textContent = "This field is required";
  }
  return isValid;
}

let isEmailTouched = false;
let isMessageTouched = false;

var emailInputLabel = document.getElementById("in-label-email");
if (emailInput.value.trim() !== "") {
  emailInputLabel.classList.add("in-label-active-qr-pf");
}

emailInput.addEventListener("focus", function () {
  emailInputLabel.classList.add("in-label-active-qr-pf");
});

emailInput.addEventListener("blur", function () {
  isEmailTouched = true;
  checkInputs();
  //validateEmail();
  if (emailInput.value.trim() === "") {
    emailInputLabel.classList.remove("in-label-active-qr-pf");
  }
  checkInputs();
});

var messageInputLabel = document.getElementById("in-label-message");

if (messageInputLabel) {
  messageInput.addEventListener("focus", function () {
    messageInputLabel.classList.add("in-label-active-qr-pf");
  });

  messageInput.addEventListener("blur", function () {
    isMessageTouched = true;
    if (messageInput.value.trim() === "") {
      messageErrorElement.classList.add("visible");
      messageInput.classList.add("input-not-valid");
      messageInputLabel.classList.remove("in-label-active-qr-pf");
    } else {
      messageErrorElement.classList.remove("visible");
      messageInput.classList.remove("input-not-valid");
    }
    checkInputs();
  });
}

var nameInput = document.getElementById("name");
var nameInputLabel = document.getElementById("in-label-name");

nameInput.addEventListener("focus", function () {
  nameInputLabel.classList.add("in-label-active-qr-pf");
});

nameInput.addEventListener("blur", function () {
  if (nameInput.value.trim() === "") {
    nameInputLabel.classList.remove("in-label-active-qr-pf");
  }
});

window.onload = function () {
  if (nameInput.value !== "") {
    nameInputLabel.classList.add("in-label-active-qr-pf");
  }
  if (messageInput && messageInput.value !== "") {
    messageInputLabel.classList.add("in-label-active-qr-pf");
  }
  if (emailInput.value !== "") {
    emailInputLabel.classList.add("in-label-active-qr-pf");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id && id !== "null") {
    const hiddenInput = document.getElementById("robot");
    hiddenInput.value = id;
  }
});
function toggleSubmitButton() {
  let isEmailValid = emailRegex.test(emailInput.value);
  if (messageInput) {
    let isMessageValid = messageInput.value.trim() !== "";
  }

  if (isEmailValid && isMessageValid) {
    submitButton.disabled = false;
    submitButton.classList.add("btn-gh-active");
  } else {
    submitButton.disabled = true;
    submitButton.classList.remove("btn-gh-active");
  }
}
emailInput.addEventListener("input", toggleSubmitButton);
if (messageInput) {
  messageInput.addEventListener("input", toggleSubmitButton);
}
