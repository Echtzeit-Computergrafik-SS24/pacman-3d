export class Input {
  constructor(canvas) {
    global.keys = {};

    canvas.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      global.keys[key] = {
        pressed: true,
        keydown: global.keys[key] == null,
      };
    });

    canvas.addEventListener("keyup", (event) => {
      delete global.keys[event.key.toLowerCase()];
    });
  }
}
