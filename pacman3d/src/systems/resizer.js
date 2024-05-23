export class Resizer {
  constructor(canvas, camera, renderer) {
    // set aspect ratio
    camera.aspect = canvas.clientWidth / canvas.clientHeight;

    // update camera's frustum
    camera.updateProjectionMatrix();

    // update size of renderer
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // set pixel ratio
    renderer.setPixelRatio(window.devicePixelRatio);
  }
}
