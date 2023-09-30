import * as THREE from 'three';
class obstacle{
 constructor()
 {
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshNormalMaterial();;
    const BoxMesh = new THREE.InstancedMesh(geometry, material)
 }
}

export default obstacle