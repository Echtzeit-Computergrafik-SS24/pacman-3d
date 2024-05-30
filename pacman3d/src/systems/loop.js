
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
      this.tick();

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

  tick() {
    const deltaTime = global.clock.getDelta();

    for (const object of this.updatables) {
      if (object.tick) {
        object.tick(deltaTime);
      }
    }
  }
}
