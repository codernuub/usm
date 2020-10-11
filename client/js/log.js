class Console {
  con
  constructor() {
    this.con = document.querySelector("#console");
  }

  error(message) {
    this.o('error', message)
  }
  log(message) {
    this.o('msg', message)
  }

  o(type, message) {
    let msg = document.createElement("span");
    msg.className = type;
    msg.innerText = message;
    this.con.appendChild(msg);
  }

}

const doc = new Console();