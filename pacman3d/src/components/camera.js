import * as THREE from "three";

export const CAM_FOLLOW_STRENGTH = .5;
export const CAM_FOLLOW_SPEED = 2;
export const CAM_FOLLOW_OFFSET = new THREE.Vector3(0, 0, 3);

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 100);

  camera.name = "camera";
  camera.position.set(0, 7, 0).add(CAM_FOLLOW_OFFSET);
  camera.lookAt(new THREE.Vector3());
  camera.tick = (deltaTime) => {
    if (global.player && !global.controls) {
      const targetPosition = new THREE.Vector3();
      global.player.mesh.getWorldPosition(targetPosition);
      targetPosition.add(CAM_FOLLOW_OFFSET);
      targetPosition.setY(camera.position.y);
      targetPosition.setX(targetPosition.x * CAM_FOLLOW_STRENGTH);
      targetPosition.setZ(targetPosition.z * CAM_FOLLOW_STRENGTH);
      targetPosition.add(CAM_FOLLOW_OFFSET);

      const v = targetPosition
        .sub(camera.position)
        .multiplyScalar(deltaTime * CAM_FOLLOW_SPEED);

      camera.position.add(v);
    }
  };

  return camera;
}
