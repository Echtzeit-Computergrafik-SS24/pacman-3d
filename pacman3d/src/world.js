import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { createCamera } from "./components/camera.js";
import { createRenderer } from "./components/renderer.js";
import { createScene } from "./components/scene.js";
import { createSkybox } from "./components/skybox.js";
import { createMapObject } from "./components/map.js";
import { createMaterials } from "./systems/material.js";
import { SUN_DIRECTION, SUN_POSITION } from "./components/light.js";

import { map } from "../assets/maps/test.map.js";

import { Resizer } from "./systems/resizer.js";
import { Loop } from "./systems/loop.js";
import { Collectable, Player, Enemy } from "./components/gameobject.js";
import { Input } from "./systems/input.js";
import { createLight } from "./components/light.js";

let camera;
let renderer;
let scene;
let loop;

export class World {
  constructor(canvas) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer(canvas);
    loop = new Loop(camera, scene, renderer);
    loop.updatables.push(camera);
    global.light = createLight();
    global.materials = createMaterials();
    global.map = JSON.parse(JSON.stringify(map));
    global.endGame = this.onGameEnd;
    global.restart = this.onRestart.bind(this);
    global.winGame = this.onGameWon;
    global.clock = new THREE.Clock();

    // add map object
    const mapObject = createMapObject(global.map.data);
    scene.add(mapObject);

    // add skybox
    const skybox = createSkybox();
    scene.add(skybox);

    // add player
    global.player = new Player(global.map.playerspawn);
    loop.updatables.push(global.player);
    mapObject.add(global.player.mesh);

    // add collectables
    global.collectables = Collectable.createCollecables(loop.updatables);
    mapObject.add(global.collectables);

    // add enemies
    global.enemies = Enemy.createEnemies(loop.updatables);
    mapObject.add(global.enemies);

    this.input = new Input();
    const resizer = new Resizer(canvas, camera, renderer);

    /* const arrow = new THREE.ArrowHelper(
      SUN_POSITION.clone().normalize(),
      new THREE.Vector3(0, 0, 0),
      SUN_POSITION.length(),
      0xff0000
    );
    scene.add(arrow); */

    /* const cameraHelper = new THREE.CameraHelper(global.light.shadow.camera);
    scene.add(cameraHelper); */

    // comment out following line to enable follow cam
    // global.controls = new OrbitControls(camera, canvas);
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }

  onGameEnd() {
    document.getElementById("ui-gameover").style.display = "flex";
    document.getElementById("ui-playing").style.display = "none";
    document.getElementById(
      "ui-var-score-gameover"
    ).textContent = `score: ${global.player.score}`;
    document.getElementById("ui-var-title").textContent = "GAME OVER!";
    loop.stop();
  }

  onGameWon() {
    document.getElementById("ui-gameover").style.display = "flex";
    document.getElementById("ui-playing").style.display = "none";
    document.getElementById(
      "ui-var-score-gameover"
    ).textContent = `score: ${global.player.score}`;
    document.getElementById("ui-var-title").textContent = "WINNER!";
    loop.stop();
  }

  onRestart() {
    this.input.removeEventListeners();
    document.getElementById("ui-gameover").style.display = "none";
    document.getElementById("ui-playing").style.display = "block";
    document.getElementById("ui-var-score").textContent = "0";
  }
}
