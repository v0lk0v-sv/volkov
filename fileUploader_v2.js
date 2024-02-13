const forma = document.getElementById("wf-form-QR-Robot-feedback");
const errorMessage = document.querySelector(".w-form-fail");
const errorMessageDiv = document.querySelector(".error-message");
const submitButtonText =  document.querySelector(".btn-text-ovrl-qr-pf");

const changeEvent = new Event("change", { bubbles: true });

const targetUrl =
  "https://webflow-user-file-uploads-tmp-production.s3.amazonaws.com";

const fileInputs = [
  document.getElementById("file"),
  document.getElementById("file-2"),
  document.getElementById("file-3"),
  document.getElementById("file-4"),
];

function processSelectedFiles(selectedFiles, fileInputs) {
  let dtt = new DataTransfer();

  xhrInterceptor(selectedFiles.length, successCallbackFunction, errorCallbackFunction);

  selectedFiles.forEach((file, index) => {
    dtt.items.add(file);
    fileInputs[index].files = dtt.files;
    dtt = new DataTransfer();
    fileInputs[index].dispatchEvent(new Event('change'));
  });
}



const xhrInterceptor = (numRequests, successCallback, errorCallback) => {
    return new Promise((resolve, reject) => {
        if (numRequests === 0) {
            resolve(true);
            return;
        }

        

        const open = XMLHttpRequest.prototype.open;
        let successfulRequests = 0;
        let totalRequests = 0;

        XMLHttpRequest.prototype.open = function (method, url) {
            const self = this;
            
            const loadHandler = function () {

    if (self.status === 204) {
        successfulRequests++;

        if (successfulRequests === numRequests) {
            resolve(successCallback());
            XMLHttpRequest.prototype.open = open;
            self.removeEventListener("load", loadHandler);
        }
    } else {
        reject(errorCallback());
        XMLHttpRequest.prototype.open = open;
        self.removeEventListener("load", loadHandler);
    }
};

            if (method.toUpperCase() === "POST" && url.includes(targetUrl)) {
                totalRequests++;

                self.addEventListener("load", loadHandler);
            }
            open.apply(this, arguments);
        };
    });
};

function successCallbackFunction() {
    forma.requestSubmit();
}; 

function errorCallbackFunction() {
    errorMessage.style.display = "block";
};

const submitHandler = function (event) {
  if (forma.selectedFiles.length > 0 && forma.selectedFiles.length < 5) {
    flag = true;
    document.dispatchEvent(new Event("flag"));
    $("#wf-form-QR-Robot-feedback").off("submit", submitHandler);
    return false;
  }
};

$("#wf-form-QR-Robot-feedback").on("submit", submitHandler);

var flag = false;
document.addEventListener("flag", function () {
  if (flag) {
    flag = false;
    submitButtonText.innerText = "Uploading...";
    processSelectedFiles(forma.selectedFiles, fileInputs);
  }
});

var clickHandler;
var timer;

function clickHandlerOnce() {
  errorMessageDiv.classList.remove('visible-fade');
  setTimeout(function() {
      errorMessage.style.display = "none";
  }, 500);
  document.removeEventListener("click", clickHandlerOnce);
  clearTimeout(timer);
}

function handleMutation(mutationsList, observer) {
  mutationsList.forEach(function(mutation) {
    if (mutation.attributeName === 'style' && errorMessage.style.display === 'block') {
      errorMessageDiv.classList.add('visible-fade');

      if (clickHandler) {
          document.removeEventListener("click", clickHandler);
      }
      clickHandler = document.addEventListener("click", clickHandlerOnce);

      clearTimeout(timer);
      timer = setTimeout(function() {
        errorMessageDiv.classList.remove('visible-fade');
        setTimeout(function() {
            errorMessage.style.display = "none";
        }, 500);
        document.removeEventListener("click", clickHandlerOnce);
      }, 3000);
    }
  });
}

var observer = new MutationObserver(handleMutation);

var targetNode = errorMessage;
var config = { attributes: true, attributeFilter: ['style'] };
observer.observe(targetNode, config);