import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { createCamera } from "./components/camera.js";
import { createRenderer } from "./components/renderer.js";
import { createScene } from "./components/scene.js";
import { createSkybox } from "./components/skybox.js";
import { createMapObject } from "./components/map.js";
import { createMaterials } from "./components/material.js";

import { map } from "../assets/maps/test.map.js";

import { Resizer } from "./systems/resizer.js";
import { Loop } from "./systems/loop.js";
import { Player } from "./components/gameobject.js";
import { Input } from "./systems/input.js";

let camera;
let renderer;
let scene;
let loop;

export const SUN_DIRECTION = new THREE.Vector3(0.3, 0.5, -1);

export class World {
  constructor(canvas) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer(canvas);
    loop = new Loop(camera, scene, renderer);
    global.materials = createMaterials();

    // add objects to scene here
    const mapObject = createMapObject(map);
    scene.add(mapObject);

    const skybox = createSkybox();
    scene.add(skybox);

    const player = new Player([1, 1]);
    loop.updatables.push(player);
    mapObject.add(player.mesh);

    const input = new Input();

    const resizer = new Resizer(canvas, camera, renderer);
    this.controls = new OrbitControls(camera, canvas);
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
}