import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

export function loadGeometryFromOBJ(path, targetMesh) {
  const loader = new OBJLoader();
  loader.load(
    path,
    (model) => {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          targetMesh.geometry = child.geometry;
        }
      });
    },
    (_) => {},
    (error) => console.error(error)
  );
}
