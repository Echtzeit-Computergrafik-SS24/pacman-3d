# Pac-Man 3D

This project was developed as part of the course "Echtzeit Computergrafik" at Furtwangen University during SS24.

## Description

A 3D-Version of the all-time classic retro game pac-man.
[Three.js](https://threejs.org/) is used for asset- and geometry management. However, no built-in materials or graphic features were used and every used material is a [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial) (see _pacman3d/src/shaders/_)

Feature/Shading highlights:
- Blinn-Phong lighting model with
    - Texturing
        - Diffuse
        - Normal
        - Specular
    - Parallax mapping
    - Shadow mapping
    - Cubemap reflection
- Instancing

## Getting Started

### Dependencies

All needed dependencies are either included in the source files (Three.js) or loaded via CDN (bootstrap).

### Usage

Use a http server to launch _index.html_ (eg. python http server or vs code).

## Author

Niklas Riedinger

