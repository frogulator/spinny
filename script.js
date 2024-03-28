import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const sphereTexture = textureLoader.load('map10.gif');

const geometry = new THREE.SphereGeometry(2, 32, 32);
const material = new THREE.MeshPhongMaterial({ map: sphereTexture });
const sphere = new THREE.Mesh(geometry, material);
sphere.castShadow = true;
scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0xffffff, .5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 3, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

let earthRotationSpeed = 0.001;

document.getElementById('earthSpeedSlider').addEventListener('input', function(e) {
    earthRotationSpeed = parseFloat(e.target.value);
});

function animate() {
    requestAnimationFrame(animate);

    sphere.rotation.y += earthRotationSpeed;

    controls.update();
    renderer.render(scene, camera);
}

animate();



// This function takes a city name and fetches its coordinates using the OSM Nominatim API
async function getCityCoordinates(cityName) {
    // Build the URL for the OSM Nominatim API request
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&format=json&limit=1`;
    
    try {
        // Make the request to the OSM Nominatim API
        const response = await fetch(url);
        const data = await response.json();
        
        // Check if we got a result
        // Inside getCityCoordinates, after successfully fetching coordinates:
if(data.length > 0) {
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    displayLocationOnGlobe(lat, lon);


            
            // Log the coordinates to the console
            console.log(`Coordinates of ${cityName}: Latitude = ${lat}, Longitude = ${lon}`);
        } else {
            // Handle case where no results are found
            console.log('City not found.');
        }
    } catch(error) {
        // Log any errors that occur during the fetch operation
        console.error('Error fetching coordinates:', error);
    }
}


document.querySelector('.plus').addEventListener('click', function() {
    
    const cityName = document.getElementById('inputValue').value;
    
    
    getCityCoordinates(cityName);
});

function createHeartShape() {
    const shape = new THREE.Shape();
    const x = -0.06, y = -0.06;
      shape.moveTo(x + 0.06, y + 0.06);
      shape.bezierCurveTo(x + 0.05, y + 0.05, x + 0.04, y, x, y);
      shape.bezierCurveTo(x - 0.06, y, x - 0.06, y + 0.07, x - 0.06, y + 0.07);
      shape.bezierCurveTo(x - 0.06, y + 0.11, x - 0.03, y + 0.154, x + 0.05, y + 0.19);
      shape.bezierCurveTo(x + 0.12, y + 0.154, x + 0.16, y + 0.11, x + 0.16, y + 0.07);
      shape.bezierCurveTo(x + 0.16, y + 0.07, x + 0.16, y, x + 0.10, y);
      shape.bezierCurveTo(x + 0.07, y, x + 0.05, y + 0.05, x + 0.05, y + 0.05);
    
    
      return shape;
}

function createStarShape() {
    // Create a new empty shape
    const starShape = new THREE.Shape();

    // Define the star points
    starShape.moveTo(0, 1.27);
    starShape.lineTo(-0.5, 0.45);
    starShape.lineTo(-1.35, 0.29);
    starShape.lineTo(-0.7, -0.33);
    starShape.lineTo(-0.82, -1.27);
    starShape.lineTo(0, -0.85);
    starShape.lineTo(0.82, -1.27);
    starShape.lineTo(0.66, -0.33);
    starShape.lineTo(1.35, 0.29);
    starShape.lineTo(0.5, 0.45);
    starShape.lineTo(0, 1.27); // Return to the starting point to close the shape

    return starShape; // Return the shape
}

function displayLocationOnGlobe(lat, lon) {
    // Determine if the checkbox is checked (true for stars, false for hearts)
    const isStar = document.querySelector('.checkbox').checked;

    const phi = (90 - lat) * (Math.PI / 180);  
    const theta = (lon + 180) * (Math.PI / 180);
    const radius = 2.01; 
 
    const globeX = -(radius * Math.sin(phi) * Math.cos(theta));
    const globeY = radius * Math.cos(phi);
    const globeZ = radius * Math.sin(phi) * Math.sin(theta);

    const shape = isStar ? createStarShape() : createHeartShape();
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({ color: isStar ? 0xffff00 : 0xff3333 }); // Yellow for stars, red for hearts
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(globeX, globeY, globeZ);
    mesh.lookAt(new THREE.Vector3(globeX * 2, globeY * 2, globeZ * 2));


    if (!isStar) {
        mesh.rotateZ(Math.PI); 
        mesh.scale.multiplyScalar(0.25); 
    } else {
        mesh.scale.multiplyScalar(0.02); 
    }
    sphere.add(mesh); 
}

