import * as THREE from "three";

export const TileType = {
  GROUND: 0,
  WALL: 1,
  GRASS: 2,
  ENEMY_SPAWN: 3,
};

export function createMapObject(mapdata) {
  const height = mapdata.length;
  const width = mapdata[0].length;
  const group = new THREE.Group();
  group.name = "map";

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tileType = mapdata[y][x];

      switch (tileType) {
        default:
          break;
        case TileType.ENEMY_SPAWN:
        case TileType.GROUND: {
          const groundTile = new THREE.Group();
          groundTile.position.set(x, 0, y);

          const scale = 1.025;
          const groundGeometry = new THREE.PlaneGeometry(scale, scale);
          groundGeometry.computeTangents();
          const ground = new THREE.Mesh(
            groundGeometry,
            global.materials.ground_parallax
          );
          ground.rotation.x = THREE.MathUtils.degToRad(-90);
          ground.name = `ground-${x}-${y}`;
          groundTile.add(ground);
          group.add(groundTile);
          break;
        }
        case TileType.WALL: {
          const wallHeight = 0.5;
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          geometry.computeTangents();
          const cube = new THREE.Mesh(geometry, global.materials.wall);
          cube.position.set(x, wallHeight - 0.5, y);
          group.add(cube);
          break;
        }
        case TileType.GRASS: {
          const groundTile = new THREE.Group();
          groundTile.position.set(x, 0, y);

          const scale = 1.0;
          const groundGeometry = new THREE.PlaneGeometry(scale, scale);
          groundGeometry.computeTangents();
          const ground = new THREE.Mesh(groundGeometry, global.materials.grass);
          ground.rotation.x = THREE.MathUtils.degToRad(-90);
          ground.name = `grass-${x}-${y}`;
          groundTile.add(ground);

          const grass = createGrass(1, 1, 0.3, 200);
          groundTile.add(grass);
          group.add(groundTile);
          break;
        }
      }
    }
  }

  group.position.set(-(width * 0.5) + 0.5, 0, -(height * 0.5) + 0.5);

  return group;
}

function createGrass(width, height, leafHeight, instances) {
  const geometry = new THREE.PlaneGeometry(0.04, leafHeight, 1, 4);
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
