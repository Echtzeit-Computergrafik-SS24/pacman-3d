import * as THREE from "three";

export const SUN_POSITION = new THREE.Vector3(10.0, 10.0, 10.0);
export const SUN_DIRECTION = SUN_POSITION.clone().multiplyScalar(-1);


export function createSkybox() {
  const loader = new THREE.CubeTextureLoader();
  loader.setPath("assets/textures/skybox/");
  /* loader.setPath("assets/textures/skybox_label/"); */
  loader.load(
    [
      "skybox-right-px.avif",
      "skybox-left-nx.avif",
      "skybox-bottom-ny.avif",
      "skybox-top-py.avif",
      "skybox-front-pz.avif",
      "skybox-back-nz.avif",
    ],
    /* [
      "skybox-right-label.avif",
      "skybox-left-label.avif",
      "skybox-bottom-label.avif",
      "skybox-top-label.avif",
      "skybox-front-label.avif",
      "skybox-back-label.avif",
    ], */
    (texture) => {
      texture.flipY = true;
      for (let [matName, material] of Object.entries(global.materials)) {
        if (material.uniforms.u_skybox) {
          material.uniforms.u_skybox.value = texture;
        }
      }
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );

  const skyboxGeometry = new THREE.BoxGeometry(20, 20, 20);
  const skybox = new THREE.Mesh(skyboxGeometry, global.materials.skybox);
  skybox.name = "skybox";
  return skybox;
}
