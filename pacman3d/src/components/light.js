import * as THREE from "three";

export const SUN_POSITION = new THREE.Vector3(5.75, 12.0, -10.0).multiplyScalar(
  1
);
export const SUN_DIRECTION = SUN_POSITION.clone().multiplyScalar(-1);

export function createLight() {
  const light = new THREE.DirectionalLight();
  light.position.copy(SUN_POSITION);

  const frustumSize = 20;
  light.shadow.camera = new THREE.OrthographicCamera(
    -frustumSize / 2,
    frustumSize / 2,
    frustumSize / 2,
    -frustumSize / 2,
    1,
    30
  );

  light.shadow.camera.position.copy(light.position);
  light.shadow.camera.lookAt(new THREE.Vector3(0, 0, 0));

  light.shadow.mapSize.x = 4096;
  light.shadow.mapSize.y = 4096;
  const options = {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
  };
  light.shadow.map = new THREE.WebGLRenderTarget(
    light.shadow.mapSize.x,
    light.shadow.mapSize.y,
    options
  );

  return light;
}
