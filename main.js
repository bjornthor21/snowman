// FAAFO
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 5);

scene.background = new THREE.Color(0xADD8E6);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const textureLoader = new THREE.TextureLoader();

const snowTexture = textureLoader.load('img/snow.jpg');
const treeTexture = textureLoader.load('img/wood.jpg');
const hatTexture  = textureLoader.load('img/hat.jpg');
const carrotTexture  = textureLoader.load('img/carrot.jpg');


const planeGeometry = new THREE.PlaneGeometry(500, 500);


const cone = new THREE.ConeGeometry( 6, 6, 32 );
const cone2 = new THREE.ConeGeometry( 1, 4, 32 );

const sphere1 = new THREE.SphereGeometry( 6, 32, 16 ); 
const sphere2 = new THREE.SphereGeometry( 7.5, 32, 16 );
const cylinder = new THREE.CylinderGeometry( 1, 1, 30, 32 ); 

const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xADD8E6 }); 
const snowMaterial = new THREE.MeshStandardMaterial({map: snowTexture});
const woodMaterial = new THREE.MeshStandardMaterial({map: treeTexture});
const hatMaterial = new THREE.MeshStandardMaterial({map: hatTexture});
const carrotMaterial = new THREE.MeshStandardMaterial({map: carrotTexture});

const hat = new THREE.Mesh(cone, hatMaterial);
const nose = new THREE.Mesh(cone2, carrotMaterial);
const top = new THREE.Mesh( sphere1, snowMaterial ); 
const bottom = new THREE.Mesh( sphere2, snowMaterial );
const hands = new THREE.Mesh( cylinder, woodMaterial );
const ground = new THREE.Mesh(planeGeometry, planeMaterial);

top.position.set(0, 6, -30);
bottom.position.set(0, -5, -30);
hat.position.set(0, 14, -30);
hands.rotation.z = Math.PI / 2;
hands.position.set(0, -3, -30);
nose.rotation.x = Math.PI / 2;
nose.position.set(0, 6, -23);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, -12, -30);

const snowManGroup = new THREE.Group();

snowManGroup.add(top, bottom, hat, hands, nose);
scene.add( snowManGroup, ground);

const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(20, 40, 20);
scene.add(light);

light.shadow.camera.left = -40;
light.shadow.camera.right = 100;
light.shadow.camera.top = 40; 
light.shadow.camera.bottom = -30;
light.castShadow = true;

top.castShadow = true;
bottom.castShadow = true;
hat.castShadow = true;
hands.castShadow = true;
nose.castShadow = true;

ground.receiveShadow = true;
renderer.shadowMap.enabled = true;

const box = new THREE.Box3().setFromObject(snowManGroup);
const center = box.getCenter(new THREE.Vector3());

snowManGroup.children.forEach((child) => {
    child.position.sub(center);
  });
    snowManGroup.position.copy(center);
  
function animate() {
	  requestAnimationFrame( animate );
    controls.update();
    snowManGroup.rotation.y += 0.01;
    renderer.render( scene, camera );
}

window.addEventListener('resize', () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

animate();
