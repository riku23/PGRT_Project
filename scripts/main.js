		
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
			LOOKSPEED = 0.05;
			var porta;
			var faroOk=false;
			var Porta_Chiusa;
			var spawnX=1, spawnY=2.5, spawnZ=1;
                        var cube1, cube2, faro, tavolo1;
			var INIBITELO=false;
			var selectedObject, oggettoFaro, oggettoFaroBool=false;
			var oldX, oldY, oldZ;
			var oggettiPrendibili, filtri=1;
			var mouse = { x: 0, y: 0 }
			oggettiPrendibili= [];
			var inventario = [];
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
                                porta = false;
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
				camera.position.x = spawnX;
				camera.position.y = spawnY;
				camera.position.z = spawnZ;

				
				// RENDERER
				// setting per il rendering della finestra
				renderer = new THREE.WebGLRenderer( { antialias: false } );
				renderer.setClearColor( 0x6699ff, 1.0 );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
				/////////////////////
				

				//CONTROLLI
				controls = new THREE.FirstPersonControls(camera);
				controls.movementSpeed = MOVESPEED;
				controls.lookSpeed = LOOKSPEED;
				controls.lookVertical = false; // Temporary solution; play on flat surfaces only
				controls.noFly = true;
				
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				window.addEventListener( 'resize', onWindowResize, false );
					

				// FUNZIONE DI PICKING
				$(document).click(function(e) {
						e.preventDefault;
							
						raycaster.setFromCamera( mouse, camera );
						intersections = raycaster.intersectObjects( oggettiPrendibili );
							
						if (e.which ==1 && INIBITELO==false){

							if(intersections.length>0 && inventario.length==0){ 
								//inventario vuoto
				   				intersected = intersections[ 0 ].object;
				   				var distance = intersections[0].distance;

				   				if(intersected && intersected!=faro && distance <3){ 					
				   					//prendo l'oggetto
				   					if(oggettoFaro==intersected){
				   						oggettoFaroBool=false;
				   					}
				   					inventario.push(intersected);
				   					intersected.position.x =100;
				   					intersected.position.y =100;
				   					intersected.position.z =100;
				   					selectedObject = intersected;
				   					oggetti = oggetti + 1;
									$('#oggetti').html(oggetti);
									console.log("preso oggetto inventario vuoto");
				   				}
							}else{
								if(intersections.length>0 && inventario.length>=filtri){
									// inventario pieno
				   					intersected = intersections[ 0 ].object;
				   					var distance = intersections[0].distance;
				   					
				   					if(intersected &&intersected!=faro && distance <3){
				   						//scambio i due oggetti
				   						inventario[0].position.x = intersected.position.x;
				   						inventario[0].position.y = intersected.position.y;
				   						inventario[0].position.z = intersected.position.z;
				   						intersected.position.x =100;
				   						intersected.position.y =100;
				   						intersected.position.z =100;
				   						selectedObject = intersected;
				   						if (oggettoFaroBool){
				   							oggettoFaro = inventario[0];
				   							checkFaro();
				   						}
				   						inventario.pop(inventario[0]);
				   						inventario.push(intersected);
				   						console.log("scambio oggetti");
				   					}else{
				   						if(intersected && intersected==faro && distance < 3 && oggettoFaroBool==false){
											//se interseco il faro posiziono l'oggetto in inventario su di esso
											selectedObject.position.x = faro.position.x;
											selectedObject.position.y = faro.position.y+2.5;
											selectedObject.position.z = faro.position.z;
											inventario.pop(selectedObject);
											oggettoFaroBool = true;
											oggettoFaro = selectedObject;
											checkFaro();
											oggetti = oggetti - 1;
											$('#oggetti').html(oggetti);
											console.log("posizionato oggetto su faro");
				   						}
				   					}

								}
							}
							
						}
					
				});


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
				var MuraEsterneGeometry = drawMuraEsterne(0,0,0,15,5,15);
				var MuraEsterneMaterial = new THREE.MeshBasicMaterial( { color: 0xF6831E, side: THREE.DoubleSide } );
				var MuraEsterne = new THREE.Mesh(MuraEsterneGeometry, MuraEsterneMaterial);
				MuraEsterne.position.y = 1;
				scene.add(MuraEsterne);
				mura.push(MuraEsterne);
				
				//Mura interne
				var MuraInterneGeometry = drawMuraInterne(5,0,5,10,5,10);
				var squareMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
				var MuraInterne = new THREE.Mesh(MuraInterneGeometry, squareMaterial);
				MuraInterne.position.y = 1;
				scene.add(MuraInterne);
				mura.push(MuraInterne);

				var MuroConPortaGeometry = drawMuroConPorta3D();
				//MuraConPorta Orizzontale 1
				var Porta1 = new THREE.Mesh(MuroConPortaGeometry, new THREE.MeshBasicMaterial( { color: 0x0000ff } ));
				Porta1.position.x = 0.8;
				Porta1.position.y = 3.5;
				Porta1.position.z = 7.5;
				scene.add( Porta1 );
				mura.push(Porta1);

				//MuraConPorta Orizzontale 2
				var Porta2 = new THREE.Mesh(MuroConPortaGeometry, new THREE.MeshBasicMaterial( { color: 0x0000ff } ));
				Porta2.position.x = 10.8;
				Porta2.position.y = 3.5;
				Porta2.position.z = 7.5;
				scene.add( Porta2 );
				mura.push(Porta2);

				//MuraConPorta Verticale 1
				var Porta3 = new THREE.Mesh(MuroConPortaGeometry, new THREE.MeshBasicMaterial( { color: 0x0000ff } ));
				//Porta3.position.x = 0.8;
				Porta3.rotation.y = - Math.PI / 2;
				Porta3.position.x = 7.5;
				Porta3.position.y = 3.5;
				Porta3.position.z = 0.8;
				scene.add( Porta3 );
				mura.push(Porta3);

				//MuraConPorta Verticale 2
				var Porta4 = new THREE.Mesh(MuroConPortaGeometry, new THREE.MeshBasicMaterial( { color: 0x0000ff } ));
				//Porta3.position.x = 0.8;
				Porta4.rotation.y = - Math.PI / 2;
				Porta4.position.x = 7.5;
				Porta4.position.y = 3.5;
				Porta4.position.z = 10.8;
				scene.add( Porta4 );
				mura.push(Porta4);

				//Porta
				var Porta_ChiusaGeometry = new THREE.BoxGeometry(0.2,3,1.8);
				Porta_Chiusa = new THREE.Mesh(Porta_ChiusaGeometry, new THREE.MeshBasicMaterial( { color: 0xff00ff } ));
				Porta_Chiusa.position.x = 9.83;
				Porta_Chiusa.position.y = 2.5;
				Porta_Chiusa.position.z = 8.64;
				scene.add( Porta_Chiusa );
				mura.push(Porta_Chiusa);

				// cube 1
				cube1 = new THREE.Mesh(
				new THREE.BoxGeometry(.5, .5, .5),
                                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/health.png')}));
				cube1.position.set(14,2.4,1 );
				oggettiPrendibili.push(cube1);
				mura.push(cube1);
				scene.add(cube1);

				//  cube 2
				cube2 = new THREE.Mesh(
				new THREE.BoxGeometry(.5, .5, .5),
                                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/ottone.jpg')}));
				cube2.position.set(3,2,3);
				oggettiPrendibili.push(cube2);
				mura.push(cube2);
				scene.add(cube2);
				
				//  faro
				/*faro = new THREE.Mesh(
				new THREE.BoxGeometry(.5, 3, .5),
                                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/ground2.jpg')}));
				faro.position.set(14,1.5,9);
				mura.push(faro);
				oggettiPrendibili.push(faro);
				scene.add(faro);
				*/

				
				
				var loader = new THREE.JSONLoader();
				loader.load( "models/faro2.js", function( geometry, materials ) { 
						// applico i materiali definiti all'interno del modello
						var materials =  new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/steel.jpg')});
						faro = new THREE.Mesh( geometry,materials );
						
						// ruoto il modello di 180° sull'asse Y
						faro.rotation.x = Math.PI/2;
                                                faro.rotation.z = Math.PI/2.5;
						// lo posiziono sopra il piano
						faro.position.set( 14.45,1.6,9 );
						// lo scalo per metterlo in scala con la scena
						faro.scale.set( 0.02,0.02,0.02);
						mura.push(faro);
						oggettiPrendibili.push(faro);
						geometry.computeBoundingBox();
                                                scene.add(faro);
						
				} );
                                
                                
                                loader.load( "models/tavolo.js", function( geometry, materials ) { 
						// applico i materiali definiti all'interno del modello
						var materials =  new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
						tavolo1 = new THREE.Mesh( geometry,materials );
						
						// ruoto il modello di 180° sull'asse Y
						tavolo1.rotation.y = Math.PI;
						// lo posiziono sopra il piano
						tavolo1.position.set( 14,1,1 );
						// lo scalo per metterlo in scala con la scena
						tavolo1.scale.set( 0.035,0.035,0.035);
						mura.push(tavolo1);
						oggettiPrendibili.push(tavolo1);
						scene.add(tavolo1);
						
				} );


			}

			
		

			function onDocumentMouseMove(e) {
				e.preventDefault();
				mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
				mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
}
		
			
			
			function checkFaro(){
				if(oggettoFaro == cube1){
					faroOk = true;
					console.log("RISOLTO!")
					porta = true;
					INIBITELO=true;
				}
			}
			
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

			function drawMuraEsterne(x1, y1, z1, x2, y2, z2)
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

			function drawMuraInterne(x1, y1, z1, x2, y2, z2)
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
				
				square.vertices.push( new THREE.Vector3( x2, y1, z1+4.5 ) );//8
				square.vertices.push( new THREE.Vector3( x2, y1+3, z1+4.5 ) );//9
				square.vertices.push( new THREE.Vector3( x2, y2, z1+4.5 ) );//10
				square.vertices.push( new THREE.Vector3( x2, y1, z1+3 ) );//11
				square.vertices.push( new THREE.Vector3( x2, y1+3, z1+3 ) );//12
				square.vertices.push( new THREE.Vector3( x2, y2, z1+3 ) );//13
				
				//Faccia Nord
				square.faces.push( new THREE.Face3( 0, 1, 2) );
				square.faces.push( new THREE.Face3( 0, 2, 3) );
				//Faccia Ovest
				square.faces.push( new THREE.Face3( 0, 3, 4) );
				square.faces.push( new THREE.Face3( 3, 4, 5) );
				//Faccia Sud
				square.faces.push( new THREE.Face3( 4, 5, 6) );
				square.faces.push( new THREE.Face3( 4, 6, 7) );
				//Faccia Est
				
				square.faces.push( new THREE.Face3( 6, 7, 8) );
				square.faces.push( new THREE.Face3( 6, 8, 10) );
				square.faces.push( new THREE.Face3( 10, 9, 12) );
				square.faces.push( new THREE.Face3( 10, 12, 13) );
				square.faces.push( new THREE.Face3( 13, 11, 1) );
				square.faces.push( new THREE.Face3( 13, 1, 2) );
				
				return square;
			}

			function drawMuroConPorta3D()
			{
				var stipiteDestro = new THREE.BoxGeometry(1.59,5,0.4);
				var material = new THREE.MeshBasicMaterial( );
				var sDmesh = new THREE.Mesh(stipiteDestro, material);
				sDmesh.position.x = 3.4;

				var traversa = new THREE.BoxGeometry(1.82,2,0.4);
				var tMesh = new THREE.Mesh(traversa, material);
				tMesh.position.x = 1.7;
				tMesh.position.y = 1.5;

				var muro = new THREE.BoxGeometry(1.59,5,0.4);
				THREE.GeometryUtils.merge(muro, tMesh);
				THREE.GeometryUtils.merge(muro, sDmesh);

				return muro;
			}
                        
                        function nuovoLivello(){
                            camera.position.x = spawnX;
                            camera.position.y = spawnY;
                            camera.position.z = spawnZ;
                           
                        }
                        
			function apriPorta(){
				if(porta==true){
					console.log("apro porta");
					Porta_Chiusa.position.y=100;
					porta = false;
				}else{
					console.log("chiudo porta");
					Porta_Chiusa.position.y=2.5;
					porta=true;
				}
			}


			// LOOP RENDERING
			// chiamo una funzione animate, che si occupa di richiedere un nuovo frame, di gestire gli update delle librerie e controlli, e poi di chiamare la funzione di rendering
			function animate() 
			{
				// richiedo un frame di rendering
				requestAnimationFrame( animate );
				// aggiorno la camerada
				if (porta==true){
					apriPorta();
                                 
				}
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
			