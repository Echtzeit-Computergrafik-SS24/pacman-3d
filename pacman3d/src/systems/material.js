import * as THREE from "three";
import { SUN_DIRECTION, SUN_POSITION } from "../components/skybox.js";

import { vertexShaderSrc as defaultVertexShaderSrc } from "../shaders/diffuse.vert.js";
import { fragmentShaderSrc as defaultFragmentShaderSrc } from "../shaders/diffuse.frag.js";
import { vertexShaderSrc as skyboxVertexShaderSrc } from "../shaders/skybox.vert.js";
import { fragmentShaderSrc as skyboxFragmentShaderSrc } from "../shaders/skybox.frag.js";
import { vertexShaderSrc as grassVertexShaderSrc } from "../shaders/grassLeaf.vert.js";
import { fragmentShaderSrc as grassFragmentShaderSrc } from "../shaders/grassLeaf.frag.js";
import { fragmentShaderSrc as parallaxFragmentShaderSrc } from "../shaders/parallax.frag.js";

export function createMaterials() {
  const materials = {
    default: new THREE.ShaderMaterial({
      uniforms: {
        u_lightPosition: { value: SUN_POSITION.clone() },
        u_diffuseColor: { value: new THREE.Vector3(1, 1, 1) },
        u_specularIntensity: { value: 0.3 },
        u_reflectionIntensity: { value: 0.05 },
        u_ambientIntensity: { value: 0.07 },
        u_skybox: { value: null },
        u_useDiffuseMap: { value: false },
        u_textureDiffuse: { value: null },
        u_useNormalMap: { value: false },
        u_textureNormal: { value: null },
        u_useSpecularMap: { value: false },
        u_textureSpecular: { value: null },
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
        u_lightPosition: { value: SUN_POSITION.clone() },
        u_diffuseColor: { value: new THREE.Vector3(0.41, 1.0, 0.5) },
        u_specularIntensity: { value: 0.2 },
        u_reflectionIntensity: { value: 0.05 },
        u_ambientIntensity: { value: 0.07 },
        u_skybox: { value: null },
        u_useDiffuseMap: { value: false },
        u_textureDiffuse: { value: null },
        u_useNormalMap: { value: false },
        u_textureNormal: { value: null },
        u_useSpecularMap: { value: false },
        u_textureSpecular: { value: null },
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
    player: new THREE.ShaderMaterial({
      uniforms: {
        u_lightPosition: { value: SUN_POSITION.clone() },
        u_diffuseColor: { value: new THREE.Vector3(1, 0.65, 0) },
        u_specularIntensity: { value: 0.3 },
        u_reflectionIntensity: { value: 0.05 },
        u_ambientIntensity: { value: 0.2 },
        u_skybox: { value: null },
        u_useDiffuseMap: { value: false },
        u_textureDiffuse: { value: null },
        u_useNormalMap: { value: false },
        u_textureNormal: { value: null },
        u_useSpecularMap: { value: false },
        u_textureSpecular: { value: null },
      },
      vertexShader: defaultVertexShaderSrc,
      fragmentShader: defaultFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "player-material",
    }),
    collectable: new THREE.ShaderMaterial({
      uniforms: {
        u_lightPosition: { value: SUN_POSITION.clone() },
        u_diffuseColor: { value: new THREE.Vector3(1, 1, 0) },
        u_specularIntensity: { value: 0.3 },
        u_reflectionIntensity: { value: 0.05 },
        u_ambientIntensity: { value: 0.1 },
        u_skybox: { value: null },
        u_useDiffuseMap: { value: false },
        u_textureDiffuse: { value: null },
        u_useNormalMap: { value: false },
        u_textureNormal: { value: null },
        u_useSpecularMap: { value: false },
        u_textureSpecular: { value: null },
      },
      vertexShader: defaultVertexShaderSrc,
      fragmentShader: defaultFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "collectable-material",
    }),
    enemy: new THREE.ShaderMaterial({
      uniforms: {
        u_lightPosition: { value: SUN_POSITION.clone() },
        u_diffuseColor: { value: new THREE.Vector3(1, 0, 0) },
        u_specularIntensity: { value: 0.5 },
        u_reflectionIntensity: { value: 0.05 },
        u_ambientIntensity: { value: 0.2 },
        u_skybox: { value: null },
        u_useDiffuseMap: { value: false },
        u_textureDiffuse: { value: null },
        u_useNormalMap: { value: false },
        u_textureNormal: { value: null },
        u_useSpecularMap: { value: false },
        u_textureSpecular: { value: null },
      },
      vertexShader: defaultVertexShaderSrc,
      fragmentShader: defaultFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "enemy-material",
    }),
    wall: new THREE.ShaderMaterial({
      uniforms: {
        u_lightPosition: { value: SUN_POSITION.clone() },
        u_diffuseColor: { value: new THREE.Vector3(1, 1, 1) },
        u_specularIntensity: { value: 0.3 },
        u_reflectionIntensity: { value: 0.0 },
        u_ambientIntensity: { value: 0.2 },
        u_skybox: { value: null },
        u_useDiffuseMap: { value: true },
        u_textureDiffuse: { value: null },
        u_useNormalMap: { value: true },
        u_textureNormal: { value: null },
        u_useSpecularMap: { value: true },
        u_textureSpecular: { value: null },
      },
      vertexShader: defaultVertexShaderSrc,
      fragmentShader: defaultFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "wall-material",
    }),
    ground_parallax: new THREE.ShaderMaterial({
      uniforms: {
        u_lightPosition: { value: SUN_POSITION.clone() },
        u_diffuseColor: { value: new THREE.Vector3(1, 1, 1) },
        u_specularIntensity: { value: 0.3 },
        u_reflectionIntensity: { value: 0.0 },
        u_ambientIntensity: { value: 0.2 },
        u_skybox: { value: null },
        u_useDiffuseMap: { value: true },
        u_textureDiffuse: { value: null },
        u_useNormalMap: { value: true },
        u_textureNormal: { value: null },
        u_useSpecularMap: { value: true },
        u_textureSpecular: { value: null },
        u_useDepthMap: { value: true },
        u_textureDepth: { value: null },
      },
      vertexShader: defaultVertexShaderSrc,
      fragmentShader: parallaxFragmentShaderSrc,
      glslVersion: THREE.GLSL3,
      name: "ground_parallax-material",
    }),
  };

  // load wall textures
  const loader = new THREE.TextureLoader();
  loader.setPath("assets/textures/rockwall/");
  // diffuse
  loader.load(
    "rockwall-diffuse.avif",
    (texture) => {
      materials.wall.uniforms.u_textureDiffuse.value = texture;
    },
    undefined,
    (error) => {
      console.log(error);
    }
  );
  // normal
  loader.load(
    "rockwall-normal.avif",
    (texture) => {
      materials.wall.uniforms.u_textureNormal.value = texture;
    },
    undefined,
    (error) => {
      console.log(error);
    }
  );
  // specular
  loader.load(
    "rockwall-specular.avif",
    (texture) => {
      materials.wall.uniforms.u_textureSpecular.value = texture;
    },
    undefined,
    (error) => {
      console.log(error);
    }
  );

  // load ground parallax textures
  loader.setPath("assets/textures/pebbles/");
  // diffuse
  loader.load(
    "pebbles-diffuse.webp",
    (texture) => {
      materials.ground_parallax.uniforms.u_textureDiffuse.value = texture;
    },
    undefined,
    (error) => {
      console.log(error);
    }
  );
  // normal
  loader.load(
    "pebbles-normal.webp",
    (texture) => {
      materials.ground_parallax.uniforms.u_textureNormal.value = texture;
    },
    undefined,
    (error) => {
      console.log(error);
    }
  );
  // specular
  loader.load(
    "pebbles-specular.webp",
    (texture) => {
      materials.ground_parallax.uniforms.u_textureSpecular.value = texture;
    },
    undefined,
    (error) => {
      console.log(error);
    }
  );
  // depth
  loader.load(
    "pebbles-depth.webp",
    (texture) => {
      materials.ground_parallax.uniforms.u_textureDepth.value = texture;
    },
    undefined,
    (error) => {
      console.log(error);
    }
  );

  // set normalMap-property of each material
  // with u_useNormalMap == true
  for (const materialName in materials) {
    if (!!materials[materialName].uniforms?.u_useNormalMap?.value) {
      materials[materialName].normalMap = true;
    }
  }

  return materials;
}
