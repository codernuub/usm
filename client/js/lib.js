
function consoleOnDom(cls, message) {
    const error = document.querySelector("#console");
    const span = document.createElement("span");
    span.innerText = message;
    span.className = cls;
    error.appendChild(span);
  }