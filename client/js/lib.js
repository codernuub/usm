class Console {
  con;
  log;
  constructor() {
    this.con = document.querySelector("#console");
    this.log = document.createElement("span");
  }
  error(message) {
    this.log.innerText = message;
    this.log.className = "error";
    this.con.appendChild(span);
  }
  log(message) {
    this.log.innerText = message;
    this.log.className = "msg";
    this.con.appendChild(span);
  }
}

const doc = new Console();

function consoleOnDom(cls, message) {
  const error = document.querySelector("#console");
  const span = document.createElement("span");
  span.innerText = message;
  span.className = cls;
  error.appendChild(span);
}
