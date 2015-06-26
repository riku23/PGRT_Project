		
		// controlla il supporto a WebGL (se la scheda grafica non lo supporta viene mostato un messaggio d'errore)
			//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
			
			var container;
			
			// variabili globali per la scena, il renderer ecc
			var scene, renderer;

			// variabili per il "prato"
			var planeGeometry, plane, planeMaterial;
			
			var raycaster = new THREE.Raycaster();
			// variabili per la camera
			var camera, controls,
			MOVESPEED = 5,
			LOOKSPEED = 0.04;
		
			var oggettiPrendibili;
			var mouse = { x: 0, y: 0 }
			oggettiPrendibili= [];
			var oggetti=0, mura;
			mura =[];
			
			// creo una istanza della classe Clock, per la gestione del tempo di esecuzione ecc
			var clock = new THREE.Clock();
			// Initialize and run on document ready
			$(document).ready(function() {
			$('body').append('<div id="intro">FIND THE LIGHT</div>');
			$('#intro').css({width: innerWidth, height: innerHeight}).one('click', function(e) {
					e.preventDefault();
					$(this).fadeOut();
					init();
					
					animate();
	});
	
	
});


			// prima chiamo funzione di inizializzazione, poi quella che gestisce il loop di rendering
			init();
			animate();
			

			// INIZIALIZZAZIONE
			//Funzioni di inizializzazione della scena
			function init() 
			{
					// Display HUD
					$('body').append('<canvas id="radar" width="200" height="200"></canvas>');
					$('body').append('<div id="hud"><p>Oggetti: <span id="oggetti">0</span></p></div>');
				
				// SCENE
				// creo una istanza della classe Scene (radice del grafo della scena che avrà come nodi i modelli, luce, ecc della scena)
				scene = new THREE.Scene();
				////////////

				// LUCI
				var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
				light.position.set(1, 1, 1 ).normalize();
				scene.add( light );
				////////////
				
				// CAMERA
				// parametri: FOV, widht, height, near, far
				// Imposto un valore di near molto + basso, in modo da evitare l'effetto del culling prima della collisione con il corpo rigido
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 100000 );
				camera.position.y = 2;
				
				//CONTROLLI
				controls = new THREE.FirstPersonControls(camera);
				controls.movementSpeed = MOVESPEED;
				controls.lookSpeed = LOOKSPEED;
				controls.lookVertical = false; // Temporary solution; play on flat surfaces only
				controls.noFly = true;
				
				// click to grab objects
				$(document).click(function(e) {
						e.preventDefault;
						if (e.which === 1) { // Left click only
						raycaster.setFromCamera( mouse, camera );
						intersections = raycaster.intersectObjects( oggettiPrendibili );
				
						if ( intersections.length > 0 ) {

				   			intersected = intersections[ 0 ].object;

					// rimetto il colore di base all'oggetto selezionato prima
							if ( intersected && oggetti < 1 ){ 
								scene.remove(intersected);
								oggetti = oggetti+1;
								$('#oggetti').html(oggetti);}

			
					
		}
	}});

				// PIANO - MESH
				// dimensioni del piano
				var side_plane = 100
				var height_plane = 2;
				
				planeGeometry = new THREE.BoxGeometry(side_plane,height_plane,side_plane);
				planeMaterial = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/ground.jpg' ), color: 0xffffff } );
				// parametri di applicazione della texture (al momento non approfondire)
				planeMaterial.map.repeat.x = 10;
				planeMaterial.map.repeat.y = 10;
				planeMaterial.map.wrapS = THREE.RepeatWrapping;
				planeMaterial.map.wrapT = THREE.RepeatWrapping;
				// creo la mesh
				plane = new THREE.Mesh(planeGeometry, planeMaterial);
				// la aggiungo alla scena
				scene.add( plane );
				
				

				//Prova Mausoleo
				// Mura esterne
				var MuraEsterneGeometry = drawMura(0,0,0,15,5,15);
				var squareMaterial = new THREE.MeshBasicMaterial( { color: 0xF6831E, side: THREE.DoubleSide } );
				var MuraEsterneMesh = new THREE.Mesh(MuraEsterneGeometry, squareMaterial);
				MuraEsterneMesh.position.y = 1;
				
				mura.push(MuraEsterneMesh);
				scene.add(MuraEsterneMesh);
				//Mura interne
				var MuraInterneGeometry = drawMura(5,0,5,10,5,10);
				var squareMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
				var MuraInterneMesh = new THREE.Mesh(MuraInterneGeometry, squareMaterial);
				MuraInterneMesh.position.y = 1;
				
				mura.push(MuraInterneMesh);
				scene.add(MuraInterneMesh);

				//MuraConPorta Orizzontale
				var Porta1Geometry = drawMuroConPorta(0,0,7.5,5,5,7.5,1.6,3.4,3)
				var Porta1Matrial = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
				var Porta1 = new THREE.Mesh(Porta1Geometry, Porta1Matrial);
				Porta1.position.y = 1;
				
				mura.push(Porta1);
				scene.add(Porta1);

				//MuraConPorta Orizzontale
				var Porta2Geometry = drawMuroConPorta(10,0,7.5,15,5,7.5,1.6,3.4,3)
				var Porta2 = new THREE.Mesh(Porta2Geometry, Porta1Matrial);
				Porta2.position.y = 1;

				mura.push(Porta2);
				scene.add(Porta2);

				//MuraConPorta Verticale
				var Porta3Geometry = drawMuroConPorta(0,0,0,5,5,0,1.6,3.4,3)
				var Porta3 = new THREE.Mesh(Porta3Geometry, Porta1Matrial);
				Porta3.rotation.y = - Math.PI / 2;
				Porta3.position.x = 7.5;
				Porta3.position.y = 1;
				
				mura.push(Porta3);
				scene.add(Porta3);

				//MuraConPorta Verticale
				var Porta4Geometry = drawMuroConPorta(0,0,0,5,5,0,1.6,3.4,3)
				var Porta4 = new THREE.Mesh(Porta4Geometry, Porta1Matrial);
				Porta4.rotation.y = - Math.PI / 2;
				Porta4.position.x = 7.5;
				Porta4.position.y = 1;
				Porta4.position.z = 10;

				mura.push(Porta4);
				scene.add(Porta4);

				// Health cube
				healthcube = new Physijs.BoxMesh(
				new THREE.BoxGeometry(1, 1, 1),
				Physijs.createMaterial(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/health.png')}),	.8, .4)
				);
				healthcube.position.set(20,1.5,20);
				oggettiPrendibili.push(healthcube);
				scene.add(healthcube)

				// RENDERER
				// setting per il rendering della finestra
				renderer = new THREE.WebGLRenderer( { antialias: false } );
				renderer.setClearColor( 0x6699ff, 1.0 );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
				/////////////////////
				
				// CONTROLLI DI CAMERA
				//controls = new THREE.OrbitControls( camera );
				/////////////////////
				
				window.addEventListener( 'resize', onWindowResize, false );
				
			}
			////////////

			
		
			
			
			
			
			// EVENTO RESIZE
			// gestione del resize, viene chiamata quando la finestra del browser viene ridimensionata
			function onWindowResize()
			{

				//ricalcolo l'aspect ratio delle camere dopo il ridimensionamento
				camera.aspect = window.innerWidth / window.innerHeight;
				//update della matrice di proiezione sulla base della nuova dimensione della finestra
				camera.updateProjectionMatrix();

				//setto le nuove dimensioni di rendering
				renderer.setSize( window.innerWidth, window.innerHeight );
				// chiamo la funzione di rendering
				render();

			}
			/////////////////

			function drawMura(x1, y1, z1, x2, y2, z2)
			{
				var square = new THREE.Geometry();
	
				square.vertices.push( new THREE.Vector3( x1, y1, z1 ) );//0
				square.vertices.push( new THREE.Vector3( x2, y1, z1 ) );//1
				square.vertices.push( new THREE.Vector3( x2, y2, z1 ) );//2
				square.vertices.push( new THREE.Vector3( x1, y2, z1 ) );//3

				square.vertices.push( new THREE.Vector3( x1, y1, z2 ) );//4
				square.vertices.push( new THREE.Vector3( x1, y2, z2 ) );//5

				square.vertices.push( new THREE.Vector3( x2, y2, z2 ) );//6
				square.vertices.push( new THREE.Vector3( x2, y1, z2 ) );//7
				//Faccia Nord
				square.faces.push( new THREE.Face3( 0, 1, 2) ); // Face4 non esiste più
				square.faces.push( new THREE.Face3( 0, 2, 3) );
				//Faccia Ovest
				square.faces.push( new THREE.Face3( 0, 3, 4) );
				square.faces.push( new THREE.Face3( 3, 4, 5) );
				//Faccia Sud
				square.faces.push( new THREE.Face3( 4, 5, 6) );
				square.faces.push( new THREE.Face3( 4, 6, 7) );
				//Faccia Est
				square.faces.push( new THREE.Face3( 6, 7, 1) );
				square.faces.push( new THREE.Face3( 6, 1, 2) );
				return square;
			}

			//disegna un muro con una porta
			function drawMuroConPorta(x1,y1,z1,x2,y2,z2,d1,d2,d3) //d1,d2,d3 misure utili alla creazione della porta
			{
				var muro = new THREE.Geometry();

				//stipite sinistro
				muro.vertices.push( new THREE.Vector3( x1, y1, z1 ) );//0
				muro.vertices.push( new THREE.Vector3( x1+d1, y1, z1 ) );//1
				muro.vertices.push( new THREE.Vector3( x1+d1, y2, z1 ) );//2
				muro.vertices.push( new THREE.Vector3( x1, y2, z1 ) );//3
				//traversa
				muro.vertices.push( new THREE.Vector3( x1+d1, y1+d3, z1 ) );//4
				muro.vertices.push( new THREE.Vector3( x1+d2, y1+d3, z1 ) );//5
				muro.vertices.push( new THREE.Vector3( x1+d2, y2, z1 ) );//6
				//stipite destro
				muro.vertices.push( new THREE.Vector3( x1+d2, y1, z1 ) );//7
				muro.vertices.push( new THREE.Vector3( x2, y1, z1 ) );//8
				muro.vertices.push( new THREE.Vector3( x2, y2, z1 ) );//9

				//Stipite sinistro
				muro.faces.push( new THREE.Face3( 0, 1, 2) ); 
				muro.faces.push( new THREE.Face3( 0, 2, 3) );
				//Traversa
				muro.faces.push( new THREE.Face3( 4, 5, 6) );
				muro.faces.push( new THREE.Face3( 4, 6, 2) );
				//Stipite destro
				muro.faces.push( new THREE.Face3( 7, 8, 9) ); 
				muro.faces.push( new THREE.Face3( 7, 9, 6) );

				return muro;
			}


			// LOOP RENDERING
			// chiamo una funzione animate, che si occupa di richiedere un nuovo frame, di gestire gli update delle librerie e controlli, e poi di chiamare la funzione di rendering
			function animate() 
			{
				// richiedo un frame di rendering
				requestAnimationFrame( animate );
				// aggiorno la camerada
			
				// chiamo la funzione di rendering
				render();
			}
			
			// funzione di rendering
			function render()
			{
				var delta = clock.getDelta(), speed = delta * MOVESPEED;
				controls.update(delta); // Move camera
				renderer.render( scene, camera );
			}
			