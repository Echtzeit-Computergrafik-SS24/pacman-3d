import * as THREE from "three";

export class GameObject {
  constructor(tileCoord) {
    this.tileCoord = tileCoord;
  }

  
}

export class Player extends GameObject {
  constructor(tileCoord) {
    super(tileCoord);

    this.init();
  }

  init() {
    const geometry = new THREE.SphereGeometry(.45, 8, 8);
    this.mesh = new THREE.Mesh(geometry, global.materials.default);
    this.mesh.name = "player";
    this.mesh.position.set(this.tileCoord[0], .5, this.tileCoord[1]);

    const map = global.scene.getObjectByName('map');
    map.add(this.mesh);

    // global.scene.add(this.mesh);
  }
}
