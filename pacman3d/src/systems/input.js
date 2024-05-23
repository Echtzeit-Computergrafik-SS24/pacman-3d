export class Input {
  constructor() {
    global.keys = {};

    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      global.keys[key] = {
        pressed: true,
        keydown: global.keys[key] == null,
      };
    });

    window.addEventListener("keyup", (event) => {
      delete global.keys[event.key.toLowerCase()];
    });
  }
}
