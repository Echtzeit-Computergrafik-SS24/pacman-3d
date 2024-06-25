export class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      const time = global.clock.elapsedTime;

      // update shader uniforms
      global.materials.grassleaf.uniforms.u_time.value = time;

      // update updatable objects
      const deltaTime = global.clock.getDelta();
      this.tick(deltaTime);

      // calculate fps
      const fpsElem = document.getElementById("ui-var-fps");
      if(fpsElem) fpsElem.textContent = `${(1.0 / deltaTime).toFixed(0)}`;

      // check each pressed key if it was pressed in the frame before
      for (let [key, value] of Object.entries(global.keys)) {
        if (value.keydown == true) {
          value.keydown = false;
        }
      }

      // render image
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick(delta) {
    for (const object of this.updatables) {
      if (object.tick) {
        object.tick(delta);
      }
    }
  }
}
