export class Input {
  constructor() {
    global.keys = {};

    window.addEventListener("keydown", this.onKeydown);
    window.addEventListener("keyup", this.onKeyup);
  }

  onKeydown(event) {
    const key = event.key.toLowerCase();
    global.keys[key] = {
      pressed: true,
      keydown: global.keys[key] == null,
    };
  }

  onKeyup(event) {
    delete global.keys[event.key.toLowerCase()];
  }

  removeEventListeners() {
    window.removeEventListener('keydown', this.onKeydown);
    window.removeEventListener('keyup', this.onKeyup);
  }
}
