import * as THREE from "three";

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

    this.score = 0;
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
      this.pickUpCollectable();
    }

    if (
      global.keys["w"]?.keydown &&
      this.canMoveTo([this.tileCoord[0], this.tileCoord[1] - 1])
    ) {
      this.mesh.position.z--;
      this.tileCoord[1]--;
      this.nextMove = time + this.moveTime;
      this.pickUpCollectable();
    }

    if (
      global.keys["a"]?.keydown &&
      this.canMoveTo([this.tileCoord[0] - 1, this.tileCoord[1]])
    ) {
      this.mesh.position.x--;
      this.tileCoord[0]--;
      this.nextMove = time + this.moveTime;
      this.pickUpCollectable();
    }

    if (
      global.keys["d"]?.keydown &&
      this.canMoveTo([this.tileCoord[0] + 1, this.tileCoord[1]])
    ) {
      this.mesh.position.x++;
      this.tileCoord[0]++;
      this.nextMove = time + this.moveTime;
      this.pickUpCollectable();
    }
  }

  canMoveTo(coord) {
    return global.map.data[coord[1]][coord[0]] == 0;
  }

  pickUpCollectable() {
    const [x, y] = this.tileCoord;

    const collectable = global.collectables.getObjectByName(
      `collectable-${x}-${y}`
    );
    if (collectable) {
      this.score++;
      global.collectables.remove(collectable);
      const uiScore = document.getElementById("ui-score");
      uiScore.textContent = `${this.score}`;
    }
  }
}

export class Collectable extends GameObject {
  constructor(tileCoord) {
    super(tileCoord);

    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    this.mesh = new THREE.Mesh(geometry, global.materials.collectable);
    this.mesh.position.set(this.tileCoord[0], 0.5, this.tileCoord[1]);
  }

  tick(deltaTime) {}

  static createCollecables(updatables) {
    const group = new THREE.Group();
    group.name = "collectables";

    for (let y = 0; y < global.map.data.length; y++) {
      for (let x = 0; x < global.map.data[0].length; x++) {
        if (global.map.data[y][x] != 0) {
          continue;
        }

        if (global.map.playerspawn[0] == x && global.map.playerspawn[1] == y) {
          continue;
        }

        const coll = new Collectable([x, y]);
        coll.mesh.name = `collectable-${x}-${y}`;
        group.add(coll.mesh);
        updatables.push(coll);
      }
    }

    return group;
  }
}
