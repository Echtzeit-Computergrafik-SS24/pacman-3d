import * as THREE from "three";
import { SUN_DIRECTION } from "../world.js";

import { vertexShaderSrc as defaultVertexShaderSrc } from "../shaders/diffuse.vert.js";
import { fragmentShaderSrc as defaultFragmentShaderSrc } from "../shaders/diffuse.frag.js";
import { vertexShaderSrc as skyboxVertexShaderSrc } from "../shaders/skybox.vert.js";
import { fragmentShaderSrc as skyboxFragmentShaderSrc } from "../shaders/skybox.frag.js";
import { vertexShaderSrc as grassVertexShaderSrc } from "../shaders/grassLeaf.vert.js";
import { fragmentShaderSrc as grassFragmentShaderSrc } from "../shaders/grassLeaf.frag.js";

export function createMaterials() {
  return {
    default: new THREE.ShaderMaterial({
      uniforms: {
        u_lightDirection: { value: SUN_DIRECTION.clone().normalize() },
        u_diffuseColor: { value: new THREE.Vector3(1, 1, 1) },
        u_specularIntensity: { value: 0.3 },
        u_reflectionIntensity: { value: 0.05 },
        u_skybox: { value: null },
      },
      vertexShader: defaultVertexShaderSrc,
      fragmentShader: defaultFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "default-material",
    }),
    skybox: new THREE.ShaderMaterial({
      uniforms: {
        u_skybox: { value: null },
      },
      vertexShader: skyboxVertexShaderSrc,
      fragmentShader: skyboxFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "skybox-material",
      side: THREE.BackSide,
    }),
    ground: new THREE.ShaderMaterial({
      uniforms: {
        u_lightDirection: { value: SUN_DIRECTION.clone().normalize() },
        u_diffuseColor: { value: new THREE.Vector3(0.41, 1.0, 0.5) },
        u_specularIntensity: { value: 0.2 },
        u_reflectionIntensity: { value: 0.05 },
        u_skybox: { value: null },
      },
      vertexShader: defaultVertexShaderSrc,
      fragmentShader: defaultFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "ground-material",
    }),
    grassleaf: new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_timeScale: { value: 3.0 },
        u_displacementStrength: { value: 0.3 },
        u_lightDirection: { value: SUN_DIRECTION.clone().normalize() },
      },
      vertexShader: grassVertexShaderSrc,
      fragmentShader: grassFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "grassleaf-material",
      side: THREE.DoubleSide,
    }),
    collectable: new THREE.ShaderMaterial({
      uniforms: {
        u_lightDirection: { value: SUN_DIRECTION.clone().normalize() },
        u_diffuseColor: { value: new THREE.Vector3(1, 1, 0) },
        u_specularIntensity: { value: 0.3 },
        u_reflectionIntensity: { value: 0.05 },
        u_skybox: { value: null },
      },
      vertexShader: defaultVertexShaderSrc,
      fragmentShader: defaultFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "collectable-material",
    }),
    enemy: new THREE.ShaderMaterial({
      uniforms: {
        u_lightDirection: { value: SUN_DIRECTION.clone().normalize() },
        u_diffuseColor: { value: new THREE.Vector3(1, 0, 0) },
        u_specularIntensity: { value: 0.3 },
        u_reflectionIntensity: { value: 0.05 },
        u_skybox: { value: null },
      },
      vertexShader: defaultVertexShaderSrc,
      fragmentShader: defaultFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "enemy-material",
    }),
  };
}
