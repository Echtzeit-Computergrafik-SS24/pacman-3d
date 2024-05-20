import * as THREE from "three";

// shader source files
import { vertexShaderSrc } from "./shaders/vertexShader.js";
import { fragmentShaderSrc } from "./shaders/fragmentShader.js";

// addons
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

export default class Game {
  constructor() {
    this.init();
  }

  init() {
    this.canvas = document.getElementById("canvas");
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 5);
    this.camera.position.z = 2;
    this.scene.add(this.camera);

    this.initMaterials();
    this.initWorldObjects();
  }

  start() {
    this.render();
  }

  initWorldObjects() {
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    const sphere = new THREE.Mesh(sphereGeometry);
    sphere.name = "sphere";
    // this.scene.add(sphere);

    const sun = new THREE.DirectionalLight(0xffffff);
    sun.name = "sun";
    sun.position.set(3, 2, 4);
    this.materials.default.uniforms.u_lightDirection.value = sun.position;
    this.scene.add(sun);

    this.loadOBj("assets/models/monkey.obj", "monkey", this.materials.default);
  }

  initMaterials() {
    this.materials = {
      default: new THREE.ShaderMaterial({
        uniforms: {
          u_lightDirection: { value: new THREE.Vector3() },
        },
        vertexShader: vertexShaderSrc,
        fragmentShader: fragmentShaderSrc,
        glslVersion: THREE.GLSL3,
        name: "default shader",
      }),
    };
  }

  loadOBj(path, name, material) {
    const loader = new OBJLoader();
    loader.load(
      path,
      (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (material) {
              child.material = material;
            }
            child.name = name;
            this.scene.add(child);
          }
        });
      },
      (_) => {},
      (error) => {
        console.log(error);
      }
    );
  }

  render(time) {
    time *= 0.001;

    const monkey = this.scene.getObjectByName("monkey");
    if (monkey) {
      monkey.rotation.x = time;
      monkey.rotation.y = time;
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }
}
