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
      if (fpsElem) fpsElem.textContent = `${(1.0 / deltaTime).toFixed(0)}`;

      // check each pressed key if it was pressed in the frame before
      for (let [key, value] of Object.entries(global.keys)) {
        if (value.keydown == true) {
          value.keydown = false;
        }
      }

      // shadow map rendering
      //
      // save original material of each object in scene
      // and apply shadow material
      this.scene.traverse((elem) => {
        if (!elem.isMesh) return;

        elem.material_orig = elem.material;
        elem.material = global.materials.shadow;
      });

      // render scene to shadow map from shadow camera perspective
      this.renderer.setRenderTarget(global.light.shadow.map);
      this.renderer.render(this.scene, global.light.shadow.camera);

      // restore original material for each object in scene
      this.scene.traverse((elem) => {
        if (!elem.isMesh) return;

        elem.material = elem.material_orig;
      });

      // render scene to canvas
      this.renderer.setRenderTarget(null);
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
