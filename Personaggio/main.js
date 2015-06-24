
var map = [ // 1  2  3  4  5  6  7  8  9
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
           [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 1
           [1, 0, 1, 1, 1, 1, 1, 1, 0, 1,], // 2
           [1, 0, 1, 0, 0, 0, 0, 1, 0, 1,], // 3
           [1, 0, 1, 0, 0, 0, 0, 1, 0, 1,], // 4
           [1, 0, 1, 0, 0, 0, 0, 1, 0, 1,], // 5
           [1, 0, 1, 0, 0, 0, 0, 1, 0, 1,], // 6
           [1, 0, 1, 1, 0, 1, 1, 1, 0, 1,], // 7
           [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 8
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
           ], mapW = map.length, mapH = map[0].length;

// Semi-constants
var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight,
	ASPECT = WIDTH / HEIGHT,
	UNITSIZE = 250,
	WALLHEIGHT = UNITSIZE*4,
	MOVESPEED = 100,
	LOOKSPEED = 0.04,
	BULLETMOVESPEED = MOVESPEED * 5,
	NUMAI = 5;
// Global vars
var t = THREE, scene, cam, renderer, controls, clock, projector, model, skin;
var runAnim = true, mouse = { x: 0, y: 0 }, oggetti = 0, health = 100;
var healthCube, lastHealthPickup = 0;
var raycaster = new THREE.Raycaster();

Physijs.scripts.worker = '../chandlerprall-Physijs-d19a7bf/physijs_worker.js';
Physijs.scripts.ammo = 'examples/js/ammo.js';

// Initialize and run on document ready
$(document).ready(function() {
	$('body').append('<div id="intro">FIND THE LIGHT</div>');
	$('#intro').css({width: WIDTH, height: HEIGHT}).one('click', function(e) {
		e.preventDefault();
		$(this).fadeOut();
		init();
		setInterval(drawRadar, 1000);
		animate();
	});
	
	
});

		physics_stats = new Stats();
		physics_stats.domElement.style.position = 'absolute';
		physics_stats.domElement.style.top = '50px';
		physics_stats.domElement.style.zIndex = 100;

// Setup
function init() {
	clock = new t.Clock(); // Used in render() for controls.update()
	scene = new Physijs.Scene; // Holds all objects in the canvas
	
	scene.fog = new t.FogExp2(0xD6F1FF, 0.0005); // color, density
	
	// Set up camera
	cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // FOV, aspect, near, far
	cam.position.y = UNITSIZE * .4;
	camCube = new Physijs.BoxMesh(
						new t.BoxGeometry(30, 90, 30),
						Physijs.createMaterial(new t.MeshBasicMaterial(),	.8, .4)
	);
	cam.add(camCube);
	scene.add(cam);
	
	// Camera moves with mouse, flies around with WASD/arrow keys
	controls = new t.FirstPersonControls(cam);
	controls.movementSpeed = MOVESPEED;
	controls.lookSpeed = LOOKSPEED;
	controls.lookVertical = false; // Temporary solution; play on flat surfaces only
	controls.noFly = true;

	// World objects
	setupScene();

	
	// Handle drawing as WebGL (faster than Canvas but less supported)
	renderer = new t.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	
	// Add the canvas to the document
	renderer.domElement.style.backgroundColor = '#D6F1FF'; // easier to see
	document.body.appendChild(renderer.domElement);
	
	// Track mouse position so we know where to shoot
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	// click to grab objects
	$(document).click(function(e) {
		e.preventDefault;
		if (e.which === 1) { // Left click only
			raycaster.setFromCamera( mouse, cam );
			intersections = raycaster.intersectObject( healthcube );
				
				if ( intersections.length > 0 ) {

				   intersected = intersections[ 0 ].object;

					// rimetto il colore di base all'oggetto selezionato prima
				if ( intersected && oggetti < 1 ){ 
					scene.remove(intersected);
					oggetti = oggetti+1;
					$('#oggetti').html(oggetti);}

			
					
		}
	}});
	
	// Display HUD
	$('body').append('<canvas id="radar" width="200" height="200"></canvas>');
	$('body').append('<div id="hud"><p>Oggetti: <span id="oggetti">0</span></p></div>');
	
	
	// Set up "hurt" flash
	$('body').append('<div id="hurt"></div>');
	$('#hurt').css({width: WIDTH, height: HEIGHT,});
}

// Helper function for browser frames
function animate() {
	if (runAnim) {
		requestAnimationFrame(animate);
	}
	render();
}

// Update and display
function render() {
	var delta = clock.getDelta(), speed = delta * MOVESPEED;
	var aispeed = delta * MOVESPEED;
	controls.update(delta); // Move camera
	
	// Rotate the health cube
	healthcube.rotation.x += 0.004
	healthcube.rotation.y += 0.008;

	renderer.render(scene, cam); // Repaint
	
	// Death
	if (oggetti > 10) {
		runAnim = false;
		$(renderer.domElement).fadeOut();
		$('#radar, #hud, #credits').fadeOut();
		$('#intro').fadeIn();
		$('#intro').html('Click to restart...');
		$('#intro').one('click', function() {
			location = location;
			
		});
	}
}

// Set up the objects in the world
function setupScene() {
	var UNITSIZE = 250, units = mapW;

	// Geometry: floor
	var floor = new Physijs.BoxMesh(
			new t.BoxGeometry(units * UNITSIZE, 10, units * UNITSIZE),
			Physijs.createMaterial(new t.MeshLambertMaterial({color: 0xEDCBA0,/*map: t.ImageUtils.loadTexture('images/floor-1.jpg')*/}),	.8, .4));
	scene.add(floor);
	
	// Geometry: walls
	var cube = new t.BoxGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
	var materials = [
	                 Physijs.createMaterial(new t.MeshLambertMaterial({/*color: 0x00CCAA,*/map: t.ImageUtils.loadTexture('images/wall-1.jpg')}),	.8, .4),
	                 Physijs.createMaterial(new t.MeshLambertMaterial({/*color: 0xC5EDA0,*/map: t.ImageUtils.loadTexture('images/wall-2.jpg')}),	.8, .4),
	                 Physijs.createMaterial(new t.MeshLambertMaterial({color: 0xFBEBCD}),	.8, .4),
	                 ];
	for (var i = 0; i < mapW; i++) {
		for (var j = 0, m = map[i].length; j < m; j++) {
			if (map[i][j]) {
				var wall = new Physijs.BoxMesh(cube, materials[map[i][j]-1]);
				wall.position.x = (i - units/2) * UNITSIZE;
				wall.position.y = WALLHEIGHT/2;
				wall.position.z = (j - units/2) * UNITSIZE;
				scene.add(wall);
			}
		}
	}
	
	// Health cube
	healthcube = new Physijs.BoxMesh(
			new t.BoxGeometry(30, 30, 30),
			Physijs.createMaterial(new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('images/health.png')}),	.8, .4)
	);
	healthcube.position.set(-UNITSIZE-15, 35, -UNITSIZE-15);
	scene.add(healthcube);
	
	// Lighting
	var directionalLight1 = new t.DirectionalLight( 0xF7EFBE, 0.7 );
	directionalLight1.position.set( 0.5, 1, 0.5 );
	scene.add( directionalLight1 );
	var directionalLight2 = new t.DirectionalLight( 0xF7EFBE, 0.5 );
	directionalLight2.position.set( -0.5, -1, -0.5 );
	scene.add( directionalLight2 );
}


function distance(x1, y1, x2, y2) {
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

function getMapSector(v) {
	var x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW/2);
	var z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW/2);
	return {x: x, z: z};
}

/**
 * Check whether a Vector3 overlaps with a wall.
 *
 * @param v
 *   A THREE.Vector3 object representing a point in space.
 *   Passing cam.position is especially useful.
 * @returns {Boolean}
 *   true if the vector is inside a wall; false otherwise.
 */
function checkWallCollision(v) {
	var c = getMapSector(v);
	return map[c.x][c.z] > 0;
}

// Radar
function drawRadar() {
	var c = getMapSector(cam.position), context = document.getElementById('radar').getContext('2d');
	context.font = '10px Helvetica';
	for (var i = 0; i < mapW; i++) {
		for (var j = 0, m = map[i].length; j < m; j++) {
			var d = 0;
			
			if (i == c.x && j == c.z && d == 0) {
				context.fillStyle = '#0000FF';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
			}
			else if (i == c.x && j == c.z) {
				context.fillStyle = '#AA33FF';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
				context.fillStyle = '#000000';
				context.fillText(''+d, i*20+8, j*20+12);
			}
			else if (d > 0 && d < 10) {
				context.fillStyle = '#FF0000';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
				context.fillStyle = '#000000';
				context.fillText(''+d, i*20+8, j*20+12);
			}
			else if (map[i][j] > 0) {
				context.fillStyle = '#666666';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
			}
			else {
				context.fillStyle = '#CCCCCC';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
			}
		}
	}
}



function onDocumentMouseMove(e) {
	e.preventDefault();
	mouse.x = (e.clientX / WIDTH) * 2 - 1;
	mouse.y = - (e.clientY / HEIGHT) * 2 + 1;
}

// Handle window resizing
$(window).resize(function() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	ASPECT = WIDTH / HEIGHT;
	if (cam) {
		cam.aspect = ASPECT;
		cam.updateProjectionMatrix();
	}
	if (renderer) {
		renderer.setSize(WIDTH, HEIGHT);
	}
	$('#intro, #hurt').css({width: WIDTH, height: HEIGHT,});
});

// Stop moving around when the window is unfocused (keeps my sanity!)
$(window).focus(function() {
	if (controls) controls.freeze = false;
});
$(window).blur(function() {
	if (controls) controls.freeze = true;
});

//Get a random integer between lo and hi, inclusive.
//Assumes lo and hi are integers and lo is lower than hi.
function getRandBetween(lo, hi) {
 return parseInt(Math.floor(Math.random()*(hi-lo+1))+lo, 10);
}



