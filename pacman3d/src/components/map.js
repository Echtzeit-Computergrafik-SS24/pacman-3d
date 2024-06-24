import * as THREE from "three";

export const TileType = {
  GROUND: 0,
  WALL: 1,
  ENEMY_SPAWN: 2,
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
        case TileType.GROUND:
          const groundTile = new THREE.Group();
          groundTile.position.set(x, 0.1, y);

          /*
          const scale = 1.0;
          const groundGeometry = new THREE.PlaneGeometry(scale, scale);
          groundGeometry.computeTangents();
          const ground = new THREE.Mesh(
            groundGeometry,
            global.materials.ground
          );
          ground.rotation.x = THREE.MathUtils.degToRad(-90);
          ground.name = `ground-${x}-${y}`;
          groundTile.add(ground);

          const grass = createGrass(1, 1, 0.3, 500);
          groundTile.add(grass);

          group.add(groundTile); */

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
        case TileType.WALL:
          const wallHeight = 0.5;
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          geometry.computeTangents();
          const cube = new THREE.Mesh(geometry, global.materials.wall);
          cube.position.set(x, wallHeight - 0.5, y);
          group.add(cube);
          break;
      }
    }
  }

  // add surrounding map area
  const envAreaWidth = 40.0;
  const envAreaData = {
    north: {
      plane_w: width,
      plane_h: envAreaWidth,
      pos_x: width / 2 - 0.5,
      pos_y: -envAreaWidth / 2 - 0.5,
    },
    north_east: {
      plane_w: envAreaWidth,
      plane_h: envAreaWidth,
      pos_x: width + envAreaWidth / 2 - 0.5,
      pos_y: -envAreaWidth / 2 - 0.5,
    },
    east: {
      plane_w: envAreaWidth,
      plane_h: height,
      pos_x: width + envAreaWidth / 2 - 0.5,
      pos_y: height / 2 - 0.5,
    },
    south_east: {
      plane_w: envAreaWidth,
      plane_h: envAreaWidth,
      pos_x: width + envAreaWidth / 2 - 0.5,
      pos_y: height + envAreaWidth / 2 - 0.5,
    },
    south: {
      plane_w: width,
      plane_h: envAreaWidth,
      pos_x: width / 2 - 0.5,
      pos_y: height + envAreaWidth / 2 - 0.5,
    },
    south_west: {
      plane_w: envAreaWidth,
      plane_h: envAreaWidth,
      pos_x: -envAreaWidth / 2 - 0.5,
      pos_y: height + envAreaWidth / 2 - 0.5,
    },
    west: {
      plane_w: envAreaWidth,
      plane_h: height,
      pos_x: -envAreaWidth / 2 - 0.5,
      pos_y: height / 2 - 0.5,
    },
    north_west: {
      plane_w: envAreaWidth,
      plane_h: envAreaWidth,
      pos_x: -envAreaWidth / 2 - 0.5,
      pos_y: -envAreaWidth / 2 - 0.5,
    },
  };

  const envAreaGrassDensity = 100.0;
  const envAreaGrassHeight = 0.5;

  for (const direction in envAreaData) {
    const planeGroup = new THREE.Group();
    const planeGeo = new THREE.PlaneGeometry(
      envAreaData[direction].plane_w,
      envAreaData[direction].plane_h
    );
    const planeMesh = new THREE.Mesh(planeGeo, global.materials.environment);
    planeMesh.rotation.x = THREE.MathUtils.degToRad(-90);
    planeGroup.position.set(
      envAreaData[direction].pos_x,
      0,
      envAreaData[direction].pos_y
    );
    planeGroup.add(planeMesh);

    const grass = createGrass(
      envAreaData[direction].plane_w,
      envAreaData[direction].plane_h,
      envAreaGrassHeight,
      envAreaData[direction].plane_w *
        envAreaData[direction].plane_h *
        envAreaGrassDensity
    );
    planeGroup.add(grass);

    group.add(planeGroup);
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
