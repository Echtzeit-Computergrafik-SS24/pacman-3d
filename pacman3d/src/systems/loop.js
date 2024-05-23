import { Clock } from "three";

const clock = new Clock();

export class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      const time = clock.getElapsedTime();

      // update shader uniforms
      global.materials.grassleaf.uniforms.u_time.value = time;

      // update updatable objects
      this.tick();

      // render image
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    const deltaTime = clock.getDelta();

    for (const object of this.updatables) {
      if (object.tick) {
        object.tick(deltaTime);
      }
    }
  }
}
