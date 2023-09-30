import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let loader = new GLTFLoader();

export function loadCarModel() {
    return new Promise((resolve, reject) => {
        loader.load('lowpoly_car_changing_1.glb', (gltf) => {
            const carModel = gltf.scene;
            carModel.position.set(0, -0.75, 15);
            resolve(carModel);
        }, undefined, reject);
    });
}
const paths = ['straight_track_ (1).glb']
let random=0;
export function loadPathModel()
{
    random = Math.floor(Math.random() * (paths.length - 0) + 0);
    return new Promise((resolve, reject) => {
        loader.load(paths[random], (gltf) => {
            const pathModel = gltf.scene;
            resolve(pathModel);
        }, undefined, reject);
    });
}


//export default {loadCarModel, loadPathModel};
