import * as THREE from "three";

import { map } from "../../assets/maps/test.map.js";

class GameObject {
  constructor(tileCoord) {
    this.tileCoord = tileCoord;
  }

  tick(deltaTime) {
    throw new Error("method not overwritten");
  }
}

export class Player extends GameObject {
  constructor(tileCoord) {
    super(tileCoord);

    const geometry = new THREE.SphereGeometry(0.45, 16, 16);
    this.mesh = new THREE.Mesh(geometry, global.materials.default);
    this.mesh.name = "player";
    this.mesh.position.set(this.tileCoord[0], 0.5, this.tileCoord[1]);

    this.nextMove = 0;
    this.moveTime = 0.1;
  }

  tick(deltaTime) {
    this.move();
  }

  move() {
    const time = global.clock.getElapsedTime();
    if (time < this.nextMove) {
      return;
    }

    if (
      global.keys["s"]?.keydown &&
      this.canMoveTo([this.tileCoord[0], this.tileCoord[1] + 1])
    ) {
      this.mesh.position.z++;
      this.tileCoord[1]++;
      this.nextMove = time + this.moveTime;
    }

    if (
      global.keys["w"]?.keydown &&
      this.canMoveTo([this.tileCoord[0], this.tileCoord[1] - 1])
    ) {
      this.mesh.position.z--;
      this.tileCoord[1]--;
      this.nextMove = time + this.moveTime;
    }

    if (
      global.keys["a"]?.keydown &&
      this.canMoveTo([this.tileCoord[0] - 1, this.tileCoord[1]])
    ) {
      this.mesh.position.x--;
      this.tileCoord[0]--;
      this.nextMove = time + this.moveTime;
    }

    if (
      global.keys["d"]?.keydown &&
      this.canMoveTo([this.tileCoord[0] + 1, this.tileCoord[1]])
    ) {
      this.mesh.position.x++;
      this.tileCoord[0]++;
      this.nextMove = time + this.moveTime;
    }
  }

  canMoveTo(coord) {
    return map[coord[1]][coord[0]] == 0;
  }
}
