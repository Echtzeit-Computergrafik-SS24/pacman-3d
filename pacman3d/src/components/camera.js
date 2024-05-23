import { PerspectiveCamera } from "three";

export function createCamera() {
  const camera = new PerspectiveCamera(75, 1, 0.1, 100);

  camera.name = "camera";
  camera.position.set(0, 10, 4);

  return camera;
}
