const forma = document.getElementById("wf-form-QR-Robot-feedback");

// Необходимо инициировать срабатывания события для подписывания файлов на стороне вебфлоу, отправка запросов
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
    console.log(dtt.files);
    fileInputs[index].files = dtt.files;
    console.log(fileInputs[index].files);
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

        // const timeoutId = setTimeout(() => {
        //     console.log(
        //         `Таймаут. Получено успешных запросов: ${successfulRequests}, всего запросов: ${totalRequests}`
        //     );
        //     reject(false);
        //     XMLHttpRequest.prototype.open = open;
        // }, 10000);

        XMLHttpRequest.prototype.open = function (method, url) {
            const self = this;
            
            const loadHandler = function () {
    console.log(`GET запрос по адресу ${url}, статус: ${self.status}`);

    if (self.status === 204) {
        successfulRequests++;

        if (successfulRequests === numRequests) {
            console.log(`Запросы исчерпаны. Получено успешных запросов: ${successfulRequests}, всего запросов: ${totalRequests}`);
            resolve(successCallback());
            XMLHttpRequest.prototype.open = open;
            self.removeEventListener("load", loadHandler);
        }
    } else {
        console.log(`Запрос с ошибкой. Получено успешных запросов: ${successfulRequests}, всего запросов: ${totalRequests}. GET запрос по адресу ${url}, статус: ${self.status}.`);
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
    console.log("Success");
    forma.requestSubmit();
}; 

function errorCallbackFunction() {
    console.log("Fault");
    document.querySelector(".w-form-fail").style.display = "block";
};

const submitHandler = function (event) {
  if (forma.selectedFiles.length > 0 && forma.selectedFiles.length < 5) {
    flag = true;
    console.log("FIRE");
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
    console.log("GOTCHA");
    document.querySelector(".btn-text-ovrl-qr-pf").innerText = "Uploading...";
    processSelectedFiles(forma.selectedFiles, fileInputs);
  }
});

var clickHandler;
var timer;

function clickHandlerOnce() {
  console.log("Клик произошел, удаляем слушатель");
  document.querySelector(".w-form-fail").style.display = "none";
  document.removeEventListener("click", clickHandlerOnce);
  clearTimeout(timer);
}

function handleMutation(mutationsList, observer) {
  mutationsList.forEach(function(mutation) {
    if (mutation.attributeName === 'style' && document.querySelector(".w-form-fail").style.display === 'block') {
      console.log("Произошло изменение атрибута style");

      if (clickHandler) {
          document.removeEventListener("click", clickHandler);
      }
      clickHandler = document.addEventListener("click", clickHandlerOnce);

      timer = setTimeout(function() {
        console.log("Таймер сработал");
        document.querySelector(".w-form-fail").style.display = "none";
        document.removeEventListener("click", clickHandlerOnce);
      }, 3000);
    }
  });
}

var observer = new MutationObserver(handleMutation);

var targetNode = document.querySelector(".w-form-fail");
var config = { attributes: true, attributeFilter: ['style'] };
observer.observe(targetNode, config);
