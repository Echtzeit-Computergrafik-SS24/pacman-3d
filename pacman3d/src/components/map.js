import * as THREE from "three";

export const TileType = {
  GROUND: 0,
  WALL: 1,
};

export function createMapObject(map) {
  const height = map.length;
  const width = map[0].length;
  const group = new THREE.Group();
  group.name = "map";

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tileType = map[y][x];

      switch (tileType) {
        default:
          break;
        case TileType.GROUND:
          const groundTile = new THREE.Group();
          groundTile.position.set(x, 0, y);

          const groundGeometry = new THREE.PlaneGeometry(1, 1);
          const ground = new THREE.Mesh(
            groundGeometry,
            global.materials.ground
          );
          ground.rotation.x = THREE.MathUtils.degToRad(-90);
          ground.name = `ground-${x}-${y}`;
          groundTile.add(ground);

          const grass = createGrass(1, 1, .3, 500);
          groundTile.add(grass);

          group.add(groundTile);
          break;
        case TileType.WALL:
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const cube = new THREE.Mesh(geometry, global.materials.default);
          cube.position.set(x, 0.5, y);
          group.add(cube);
          break;
      }
    }
  }

  group.position.set(-(width * 0.5) + 0.5, 0, -(height * 0.5) + 0.5);

  return group;
}

function createGrass(width, height, leafHeight, instances) {
  const geometry = new THREE.PlaneGeometry(0.01, leafHeight, 1, 4);
  geometry.translate(0, 0.5 * leafHeight, 0);

  const dummy = new THREE.Object3D();

  const instancedMesh = new THREE.InstancedMesh(
    geometry,
    global.materials.grassleaf,
    instances
  );

  for (let i = 0; i < instances; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * width,
      0,
      (Math.random() - 0.5) * height
    );
    dummy.scale.setScalar(0.7 + Math.random() * 0.3);
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.updateMatrix();

    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  return instancedMesh;
}
