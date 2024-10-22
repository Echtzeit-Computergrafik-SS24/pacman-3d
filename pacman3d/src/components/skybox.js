import * as THREE from "three";

export function createSkybox() {
  const loader = new THREE.CubeTextureLoader();
  loader.setPath("pacman3d/assets/textures/skybox/");
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

  const skyboxGeometry = new THREE.BoxGeometry(100, 100, 100);
  const skybox = new THREE.Mesh(skyboxGeometry, global.materials.skybox);
  skybox.rotation.x = THREE.MathUtils.degToRad(70);
  skybox.name = "skybox";
  return skybox;
}
