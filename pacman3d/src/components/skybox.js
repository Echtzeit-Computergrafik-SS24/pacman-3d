import * as THREE from "three";

export function createSkybox() {
  const loader = new THREE.CubeTextureLoader();
  loader.setPath("assets/textures/skybox/");
  loader.load(
    [
      "skybox-right-px.avif",
      "skybox-left-nx.avif",
      "skybox-top-py.avif",
      "skybox-bottom-ny.avif",
      "skybox-front-pz.avif",
      "skybox-back-nz.avif",
    ],
    (texture) => {
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
