import * as THREE from 'https://unpkg.com/three/build/three.module.js';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
let cityMarkers = [];
let citiesData = [];
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const sphereTexture = textureLoader.load('map10.gif');

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const geometry = new THREE.SphereGeometry(2.5, 32, 32);
const material = new THREE.MeshPhongMaterial({ map: sphereTexture });
const sphere = new THREE.Mesh(geometry, material);
sphere.castShadow = true;
scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 3, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3; 
controls.enablePan = true; 

let earthRotationSpeed = 0.001;

const slowRotationSpeed = 0.00005;
let currentRotationSpeed = earthRotationSpeed;
const speedLerpFactor = 0.007;

document.getElementById('earthSpeedSlider').addEventListener('input', function(e) {
    earthRotationSpeed = parseFloat(e.target.value);
});

let isHovering = false; 


function animate() {
    requestAnimationFrame(animate);

    const targetSpeed = isHovering ? slowRotationSpeed : earthRotationSpeed;

    // Interpolate current rotation speed towards target speed
    currentRotationSpeed += (targetSpeed - currentRotationSpeed) * speedLerpFactor;

    // Apply the interpolated rotation speed
    sphere.rotation.y += currentRotationSpeed;

    controls.update();
    renderer.render(scene, camera);
    updateInfoboxPositions(); 
}


animate();




async function getCityCoordinates(cityName) {
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&format=json&limit=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if(data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            citiesData.push({ lat, lon, cityName });
            displayLocationOnGlobe(lat, lon, cityName);

            console.log(`Coordinates of ${cityName}: Latitude = ${lat}, Longitude = ${lon}`);
        } else {
            console.log('City not found.');
        }
    } catch(error) {
        console.error('Error fetching coordinates:', error);
    }
}


document.querySelector('.plus').addEventListener('click', function() {
    
    const cityName = document.getElementById('inputValue').value;
    
    
    getCityCoordinates(cityName);
});

document.getElementById('inputValue').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const cityName = document.getElementById('inputValue').value;
        getCityCoordinates(cityName);
    }
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
    const starShape = new THREE.Shape();
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
    starShape.lineTo(0, 1.27); 
    return starShape; 
}

function displayLocationOnGlobe(lat, lon, cityName) {
    const isStar = document.querySelector('.checkbox').checked;

    const phi = (90 - lat) * (Math.PI / 180);  
    const theta = (lon + 180) * (Math.PI / 180);
    const radius = 2.51; 

    const globeX = -(radius * Math.sin(phi) * Math.cos(theta));
    const globeY = radius * Math.cos(phi);
    const globeZ = radius * Math.sin(phi) * Math.sin(theta);

    const shape = isStar ? createStarShape() : createHeartShape();
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({ color: isStar ? 0xffff00 : 0xff3333 }); // Yellow for stars, red for hearts
    const mesh = new THREE.Mesh(geometry, material);

    mesh.userData = { cityName }; 
    mesh.position.set(globeX, globeY, globeZ);
    mesh.lookAt(new THREE.Vector3(globeX * 2, globeY * 2, globeZ * 2));

    if (!isStar) {
        mesh.rotateZ(Math.PI); 
        mesh.scale.multiplyScalar(0.3); 
    } else {
        mesh.scale.multiplyScalar(0.03); 
    }

    mesh.userData.name = cityName;

    const infobox = document.createElement('div');
    infobox.className = 'infobox';
    infobox.id = `info-${cityName}`;
    infobox.innerText = cityName;
    infobox.style.position = 'absolute';
    infobox.style.display = 'none'; // Initially hidden
    document.body.appendChild(infobox);

    sphere.add(mesh); 
    cityMarkers.push(mesh);
}


function redrawMarkers() {
    
    cityMarkers.forEach(marker => sphere.remove(marker));
    cityMarkers = []; 

    citiesData.forEach(city => {
        displayLocationOnGlobe(city.lat, city.lon, city.cityName);
    });
}

document.querySelector('.checkbox').addEventListener('change', redrawMarkers);



document.addEventListener('mousemove', function(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(sphere);
    isHovering = intersects.length > 0;
});


function updateInfoboxPositions() {
    cityMarkers.forEach(marker => {
        const vector = new THREE.Vector3();
        marker.getWorldPosition(vector);
        vector.project(camera);

        const x = (0.5 + vector.x / 2) * window.innerWidth;
        const y = (0.5 - vector.y / 2) * window.innerHeight;

        const infobox = document.getElementById(`info-${marker.userData.name}`);
        if (infobox) {
            infobox.style.left = `${x}px`;
            infobox.style.top = `${y}px`;
        }
    });
}

document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(sphere.children);

    cityMarkers.forEach(marker => {
        const infobox = document.getElementById(`info-${marker.userData.name}`);
        if (infobox) {
            infobox.style.display = 'none'; 
        }
    });

    if (intersects.length > 0) {
        const intersected = intersects[0].object.userData.name;
        const infobox = document.getElementById(`info-${intersected}`);
        if (infobox) {
            infobox.style.display = 'block'; 
            updateInfoboxPositions(); 
        }
    }
}

const style = document.createElement('style');
style.innerHTML = `
  .infobox {
    color: white;
    padding: 8px;
    border-radius: 4px;
    display: none;
    position: absolute;
    transform: translate(5%, -25%);
    pointer-events: none;
    z-index: 100;
  }
`;
document.head.appendChild(style);