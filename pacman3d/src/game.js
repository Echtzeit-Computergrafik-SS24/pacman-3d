import * as THREE from "three";

// shader source files
import { vertexShaderSrc as defaultVertexShaderSrc } from "./shaders/default.vert.js";
import { fragmentShaderSrc as defaultFragmentShaderSrc } from "./shaders/default.frag.js";
import { vertexShaderSrc as grassVertexShaderSrc } from "./shaders/grassLeaf.vert.js";
import { fragmentShaderSrc as grassFragmentShaderSrc } from "./shaders/grassLeaf.frag.js";

// addons
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class Game {
  constructor() {
    this.init();
  }

  init() {
    this.canvas = document.getElementById("canvas");
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      100
    );
    this.camera.name = "camera";
    this.camera.position.set(0, 4, 10);
    this.scene.add(this.camera);

    this.sun = new THREE.DirectionalLight(0xffffff);
    this.sun.name = "sun";
    this.sun.position.set(0.5, 0.5, -1);
    this.scene.add(this.sun);

    this.initMaterials();
    this.initWorldObjects();

    this.controls = new OrbitControls(this.camera, this.canvas);
  }

  start() {
    this.render();
  }

  initWorldObjects() {
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    const sphere = new THREE.Mesh(sphereGeometry);
    sphere.name = "sphere";
    // this.scene.add(sphere);

    // this.loadOBj("assets/models/monkey.obj", "monkey", this.materials.default);

    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    this.createDiffuseMaterial("floor", 0x68ff7f, 0.2);
    const floor = new THREE.Mesh(floorGeometry, this.materials["floor"]);
    floor.rotation.x = THREE.MathUtils.degToRad(-90);
    floor.name = "floor";
    this.scene.add(floor);

    const grass = this.createGrassPlane(10, 10, 0.7, 5000);
    this.scene.add(grass);
  }

  initMaterials() {
    console.log(this.sun.position);
    this.materials = {
      default: new THREE.ShaderMaterial({
        uniforms: {
          u_lightDirection: { value: this.sun.position.clone().normalize() },
          u_diffuseColor: { value: new THREE.Vector3(1, 1, 1) },
          u_specularIntensity: { value: 0.5 },
        },
        vertexShader: defaultVertexShaderSrc,
        fragmentShader: defaultFragmentShaderSrc,
        glslVersion: THREE.GLSL3,
        name: "default-mat",
      }),
      grassLeaves: new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_timeScale: { value: 5.0 },
        },
        vertexShader: grassVertexShaderSrc,
        fragmentShader: grassFragmentShaderSrc,
        glslVersion: THREE.GLSL3,
        name: "grass-mat",
        side: THREE.DoubleSide,
      }),
    };
  }

  createDiffuseMaterial(name, hexColor, specular = 0.5) {
    const color = new THREE.Color(hexColor);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_lightDirection: { value: this.sun.position.clone().normalize() },
        u_diffuseColor: { value: new THREE.Vector3(color.r, color.g, color.b) },
        u_specularIntensity: { value: specular },
      },
      vertexShader: defaultVertexShaderSrc,
      fragmentShader: defaultFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: name,
    });

    if (!this.materials[name]) {
      this.materials[name] = material;
    }

    return material;
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

  createGrassPlane(width, height, leafHeight, instanceNum) {
    const geometry = new THREE.PlaneGeometry(0.1, leafHeight, 1, 4);
    geometry.translate(0, 0.5, 0);

    /* const geometry = new THREE.ConeGeometry(.1, 1, undefined, 4);
    geometry.translate(0, 0.5, 0); */


    const dummy = new THREE.Object3D();

    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      this.materials.grassLeaves,
      instanceNum
    );

    // position each leaf
    for (let i = 0; i < instanceNum; i++) {
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

  render(time) {
    time *= 0.001;

    this.materials.grassLeaves.uniforms.u_time.value = time;

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }
}
