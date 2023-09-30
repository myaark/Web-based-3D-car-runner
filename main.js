import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es'
import {loadCarModel, loadPathModel} from './loader'

//setup the renderer
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//setup the scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const backgroundTexture = new THREE.TextureLoader().load('bgtexture.jpg');
scene.background = backgroundTexture;

//creating a cannon js world
const world = new CANNON.World({
	gravity: new CANNON.Vec3(0, -9.82, 0),
})

/*adding a box
const boxBody = new CANNON.Body({
  mass: 1, 
  shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),

}) 

const groundBody = new CANNON.Body({
	type: CANNON.Body.STATIC,
	shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
world.addBody(groundBody);


const meshes =[]
const bodies = []
*/


//adding orbit controls lighting and camera positioning
const orbit = new OrbitControls(camera,renderer.domElement);
camera.position.set(0, 2, 25);
orbit.update();
const light = new THREE.AmbientLight('#ffffff'); 
scene.add(light);

let loadedCarModel;
loadCarModel().then((carModel) => {
	loadedCarModel = carModel;
    scene.add(loadedCarModel);
}).catch((error) => {
    console.error("Error loading model:", error);
});
let distance = 0;
let backDistance =0;
let box;
let size;
let modelArray =[]

function generateTrack()
{	if(modelArray.length < 2)
	{
		loadPathModel().then((pathModel) => {
			scene.add(pathModel);
			modelArray.push(pathModel)
			pathModel.position.z=distance;
			box = new THREE.Box3().setFromObject( pathModel );
			size = box.getSize(new THREE.Vector3());
			distance +=size.z;
		}).catch((error) => {
			console.error("Error loading model:", error);
		});
		
	}
	if((loadedCarModel.position.z - backDistance) > size.z)
	{
		scene.remove(modelArray[0]);
		modelArray.shift();
		backDistance = loadedCarModel.position.z;
	}
	
	
}


/*const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshNormalMaterial();
function addobj()
{
	const boxBody = new CANNON.Body({
		mass: 1, 
		shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
	  
	  })
	const boxMesh = new THREE.Mesh(geometry, material);
	world.addBody(boxBody);
	scene.add(boxMesh);
	meshes.push(boxMesh);
	bodies.push(boxBody);
}
const range = 6000
setInterval(addobj,range)
*/
//setup the controller
const controller = {
	forward: false,
	speed: 1,
	backward: false
};
	
	//adding event listeners for the control plus movement of the car logic
	window.addEventListener('keydown', (e) => {
		switch (e.key) {
			case 'w':
				controller.forward = true;
				break;
				case 's':
					controller.backward = true;
					break;
				}
			});
			
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            controller.forward = false;
            break;
		case 's':
			controller.backward = false;
		break;
    }
});

function move()
{
	if (controller.forward) {
        loadedCarModel.position.z += controller.speed;
		camera.position.z += controller.speed
    }
	if(controller.backward)
	{
		loadedCarModel.position.z -= controller.speed;
		camera.position.z -= controller.speed
	}
}

function animate() {
	move();
	requestAnimationFrame( animate );
	generateTrack();
	/*world.fixedStep();

	for(let i=0;i<meshes.length;i++)
	{
		meshes[i].position.copy(bodies[i].position)
		meshes[i].quaternion.copy(bodies[i].quaternion)
	}
	plane.position.copy(groundBody.position)
	plane.quaternion.copy(groundBody.quaternion)*/
	renderer.render( scene, camera );
}
animate();
