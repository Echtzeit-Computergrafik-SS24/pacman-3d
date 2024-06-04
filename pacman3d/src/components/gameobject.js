import * as THREE from "three";

import { TileType } from "./map.js";

import { loadGeometryFromOBJ } from "../systems/loader.js";

export const Direction = {
  NONE: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4,
};
export const DirectionValues = [
  [0, 0],
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
export const DirectionNames = ["none", "up", "right", "down", "left"];

class GameObject {
  constructor(position) {
    this.position = position;
  }

  tick(deltaTime) {
    throw new Error("method not overwritten");
  }
}

export class Player extends GameObject {
  constructor(position) {
    super(position);

    this.mesh = new THREE.Mesh();
    loadGeometryFromOBJ("assets/models/player.obj", this.mesh);
    this.mesh.material = global.materials.player;
    this.mesh.name = "player";
    this.mesh.position.set(this.position[0], 0.5, this.position[1]);

    this.nextMoveTime = 0;
    this.timeBetweenMoves = 0.1;

    this.score = 0;
  }

  tick(deltaTime) {
    this.move(deltaTime);
  }

  getNextDirection() {
    if (
      global.keys["s"]?.keydown &&
      this.canMoveTo([
        this.position[0] + DirectionValues[Direction.DOWN][0],
        this.position[1] + DirectionValues[Direction.DOWN][1],
      ])
    )
      return Direction.DOWN;

    if (
      global.keys["w"]?.keydown &&
      this.canMoveTo([
        this.position[0] + DirectionValues[Direction.UP][0],
        this.position[1] + DirectionValues[Direction.UP][1],
      ])
    )
      return Direction.UP;

    if (
      global.keys["a"]?.keydown &&
      this.canMoveTo([
        this.position[0] + DirectionValues[Direction.LEFT][0],
        this.position[1] + DirectionValues[Direction.LEFT][1],
      ])
    )
      return Direction.LEFT;

    if (
      global.keys["d"]?.keydown &&
      this.canMoveTo([
        this.position[0] + DirectionValues[Direction.RIGHT][0],
        this.position[1] + DirectionValues[Direction.RIGHT][1],
      ])
    )
      return Direction.RIGHT;

    return Direction.NONE;
  }

  move(deltaTime) {
    const time = global.clock.elapsedTime;
    if (time < this.nextMoveTime) return;

    const nextDirection = this.getNextDirection();
    if (nextDirection == Direction.NONE) return;

    // move logical position on mpa
    this.position[0] += DirectionValues[nextDirection][0];
    this.position[1] += DirectionValues[nextDirection][1];

    // move mesh
    this.mesh.position.add(
      new THREE.Vector3(
        DirectionValues[nextDirection][0],
        0,
        DirectionValues[nextDirection][1]
      )
    );

    // rotate mesh
    const rad = Math.atan2(
      DirectionValues[nextDirection][0],
      DirectionValues[nextDirection][1]
    );
    this.mesh.rotation.y = rad;

    this.nextMoveTime = time + this.timeBetweenMoves;
    this.pickUpCollectable();
  }

  canMoveTo(coord) {
    return global.map.data[coord[1]][coord[0]] !== TileType.WALL;
  }

  pickUpCollectable() {
    const [x, y] = this.position;

    const collectable = global.collectables.getObjectByName(
      `collectable-${x}-${y}`
    );
    if (collectable) {
      this.score++;
      global.collectables.remove(collectable);
      document.getElementById("ui-var-score").textContent = `${this.score}`;
    }

    if (global.collectables.children.length === 0) {
      // all collectables collected, game won
      global.winGame();
    }
  }
}

export class Enemy extends GameObject {
  constructor(position) {
    super(position);

    const geometry = new THREE.SphereGeometry(0.45, 16, 16);
    this.mesh = new THREE.Mesh(geometry, global.materials.enemy);
    this.mesh.position.set(this.position[0], 0.5, this.position[1]);

    this.timeBetweenMoves = 1.0;
    this.nextMoveTime = this.timeBetweenMoves;
    this.currentDirection = Direction.RIGHT;
  }

  tick(deltaTime) {
    this.move(deltaTime);

    if (this.checkForPlayerCollision()) {
      global.endGame();
    }
  }

  move(deltaTime) {
    const time = global.clock.elapsedTime;
    if (time < this.nextMoveTime) return;

    return; // TODO: remove me

    const nextDirection = this.getNextDirection();
    if (nextDirection == Direction.NONE) return;

    this.position[0] += DirectionValues[nextDirection][0];
    this.position[1] += DirectionValues[nextDirection][1];
    this.mesh.position.add(
      new THREE.Vector3(
        DirectionValues[nextDirection][0],
        0,
        DirectionValues[nextDirection][1]
      )
    );

    this.nextMoveTime = time + this.timeBetweenMoves;
  }

  getNextDirection() {
    let nextDirection = this.currentDirection;

    let directionTurnRight, directionTurnLeft;
    switch (this.currentDirection) {
      case Direction.UP:
        directionTurnRight = Direction.RIGHT;
        directionTurnLeft = Direction.LEFT;
        break;
      case Direction.RIGHT:
        directionTurnRight = Direction.UP;
        directionTurnLeft = Direction.DOWN;
        break;
      case Direction.DOWN:
        directionTurnRight = Direction.LEFT;
        directionTurnLeft = Direction.RIGHT;
        break;
      case Direction.LEFT:
        directionTurnRight = Direction.UP;
        directionTurnLeft = Direction.DOWN;
        break;
      default:
        break;
    }

    const nextPositionInFront = [
      this.position[0] + DirectionValues[nextDirection][0],
      this.position[1] + DirectionValues[nextDirection][1],
    ];
    const positionTurnRight = [
      this.position[0] + DirectionValues[directionTurnRight][0],
      this.position[1] + DirectionValues[directionTurnRight][1],
    ];
    const positionTurnLeft = [
      this.position[0] + DirectionValues[directionTurnLeft][0],
      this.position[1] + DirectionValues[directionTurnLeft][1],
    ];

    const tileInFront =
      global.map.data[nextPositionInFront[1]][nextPositionInFront[0]];
    const tileRight =
      global.map.data[positionTurnRight[1]][positionTurnRight[0]];
    const tileLeft = global.map.data[positionTurnLeft[1]][positionTurnLeft[0]];

    if (
      tileInFront !== TileType.WALL &&
      tileRight === TileType.WALL &&
      tileLeft === TileType.WALL
    ) {
      // if we can only move to next tile, keep current direction
      return this.currentDirection;
    } else {
      // we hit a wall and need to find a new direction
      const possibleDirections = [
        Direction.UP,
        Direction.RIGHT,
        Direction.DOWN,
        Direction.LEFT,
      ].filter((direction) => this.checkDirection(direction));

      if (possibleDirections.length > 0) {
        // pick one of the possible directions
        nextDirection =
          possibleDirections[
            Math.floor(Math.random() * possibleDirections.length)
          ];
      } else {
        // if we have no possible direction, we go where we came from
        switch (this.currentDirection) {
          case Direction.UP:
            nextDirection = Direction.DOWN;
            break;
          case Direction.RIGHT:
            nextDirection = Direction.LEFT;
            break;
          case Direction.DOWN:
            nextDirection = Direction.UP;
            break;
          case Direction.LEFT:
            nextDirection = Direction.RIGHT;
            break;
          default:
            break;
        }
      }

      this.currentDirection = nextDirection;
    }

    return nextDirection;
  }

  checkDirection(direction) {
    // avoid going where we came from
    switch (this.currentDirection) {
      case Direction.UP:
        if (direction === Direction.DOWN) return false;
        break;
      case Direction.RIGHT:
        if (direction === Direction.LEFT) return false;
        break;
      case Direction.DOWN:
        if (direction === Direction.UP) return false;
        break;
      case Direction.LEFT:
        if (direction === Direction.RIGHT) return false;
        break;
      default:
        break;
    }

    let nextPosition = [
      this.position[0] + DirectionValues[direction][0],
      this.position[1] + DirectionValues[direction][1],
    ];

    const nextTile = global.map.data[nextPosition[1]][nextPosition[0]];

    return nextTile !== TileType.WALL;
  }

  checkForPlayerCollision() {
    return (
      global.player.position[0] === this.position[0] &&
      global.player.position[1] === this.position[1]
    );
  }

  static createEnemies(updatables) {
    const group = new THREE.Group();
    group.name = "enemies";

    for (let y = 0; y < global.map.data.length; y++) {
      for (let x = 0; x < global.map.data[0].length; x++) {
        if (global.map.data[y][x] != TileType.ENEMY_SPAWN) continue;

        if (global.map.playerspawn[0] == x && global.map.playerspawn[1] == y)
          continue;

        const enemy = new Enemy([x, y]);
        enemy.mesh.name = `enemy-${x}-${y}`;
        group.add(enemy.mesh);
        updatables.push(enemy);
      }
    }

    return group;
  }
}

export class Collectable extends GameObject {
  constructor(position) {
    super(position);

    this.yPosition = 0.5;
    this.bounceHeight = 0.1;
    this.bounceSpeed = 2.0;

    this.mesh = new THREE.Mesh();
    loadGeometryFromOBJ("assets/models/coin.obj", this.mesh);
    this.mesh.material = global.materials.collectable;
    this.mesh.position.set(this.position[0], this.yPosition, this.position[1]);
  }

  tick(deltaTime) {
    const time = global.clock.elapsedTime;

    // animate rotation
    const radPerSecond = THREE.MathUtils.degToRad(90);
    this.mesh.rotation.y += radPerSecond * deltaTime;

    // animate bounce
    const bounce =
      Math.sin(time * this.bounceSpeed + this.position[0] + this.position[1]) *
      this.bounceHeight;
    this.mesh.position.setY(this.yPosition + bounce);
  }

  static createCollecables(updatables) {
    const group = new THREE.Group();
    group.name = "collectables";

    for (let y = 0; y < global.map.data.length; y++) {
      for (let x = 0; x < global.map.data[0].length; x++) {
        if (global.map.data[y][x] != TileType.GROUND) continue;

        if (global.map.playerspawn[0] == x && global.map.playerspawn[1] == y)
          continue;

        const coll = new Collectable([x, y]);
        coll.mesh.name = `collectable-${x}-${y}`;
        group.add(coll.mesh);
        updatables.push(coll);
      }
    }

    return group;
  }
}
