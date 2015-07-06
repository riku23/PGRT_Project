
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
var porta = false;
var Porta_Chiusa;
var healthcube;
var oggettiPrendibili;
var cylinder;
var mouse = {x: 0, y: 0}

var doorLight;
oggettiPrendibili = [];
var inventario = [];
var oggetti = 0, mura;
mura = [];

//MESH
var cylinder;

//OBJECT
var light_cone;

// creo una istanza della classe Clock, per la gestione del tempo di esecuzione ecc
var clock = new THREE.Clock();
// Initialize and run on document ready
$(document).ready(function () {
    $('body').append('<div id="intro">FIND THE LIGHT</div>');
    $('#intro').css({width: innerWidth, height: innerHeight}).one('click', function (e) {
        e.preventDefault();
        $(this).fadeOut();
        init();

        animate();
    });


});
function orientate_cone() {
    //calcolo dell'orientamento del cilindro
    //cateto dell'altezza 
    var c = Math.abs(doorLight.target.position.y - light_cone.position.y);
    //alert(c);
    //teorema di pitagora per calcolare l'altro cateto
    var b = Math.sqrt(
            Math.pow(Math.abs(((doorLight.position.x) - (doorLight.target.position.x))), 2) +
            Math.pow(Math.abs((doorLight.position.z - doorLight.target.position.z)), 2));
    //alert(b);
    //calcolo rotazione lungo asse xs
    var alfa = Math.atan((c / b));
    //alert(alfa);
    light_cone.rotation.z = +alfa - Math.PI / 2;
    //light_cone.rotation.x = 120;
    //light_cone.rotation.z = -Math.PI/2;

    //Devo spostare il cono in avanti e in alto/basso per farlo corrispondere al fascio di luce
    light_cone.position.x = light_cone.position.x - (cylinder.parameters.height / 2);

    //calcolo la differenza sulle y e sulle x tra la luce e il target
    var a = Math.abs(light_cone.position.y - doorLight.target.position.y);
    var b = Math.abs(light_cone.position.x - doorLight.target.position.x);
    //con una proporzione determino l'altezza del cono
    var new_y = (a * (cylinder.parameters.height / 2)) / b;

    light_cone.position.y = doorLight.position.y - new_y;

}
function light_placing() {

    //////////////////////////////////////////////////////////////////////////////////
    //		add a volumetric spotligth					//
    //////////////////////////////////////////////////////////////////////////////////

    // add spot light
    var geometry = new THREE.CylinderGeometry(0.1, 1.5, 5, 32 * 2, 20, true);
    // var geometry	= new THREE.CylinderGeometry( 0.1, 5*Math.cos(Math.PI/3)/1.5, 5, 32*2, 20, true);
    //geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0));
    //geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    // geometry.computeVertexNormals()
    // var geometry	= new THREE.BoxGeometry( 3, 1, 3 );
    // var material	= new THREE.MeshNormalMaterial({
    // 	side	: THREE.DoubleSide
    // });
    // var material	= new THREE.MeshPhongMaterial({
    // 	color		: 0x000000,
    // 	wireframe	: true,
    // })
    var material = new THREEx.VolumetricSpotLightMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(1.5, 2, 0);
    mesh.lookAt(new THREE.Vector3(0, 0, 0));
    material.uniforms.lightColor.value.set('white');
    material.uniforms.spotPosition.value = mesh.position;
    material.uniforms['anglePower'].value = 0;
    material.uniforms['attenuation'].value = 5;
    //material.uniforms.lightColor.value.set(options.lightColor);
    mesh.position.set(11, 4, 8.64);
    scene.add(mesh);


    // LUCI
    var pointColor = "#ffffff";
    doorLight = new THREE.SpotLight(pointColor);
    doorLight.position.set(15, 4, 8.64);
    doorLight.castShadow = true;
    doorLight.shadowCameraNear = 0.1;
    doorLight.shadowCameraFar = 6;/*
     doorLight.shadowCameraFov = 6;
     doorLight.shadowCameraLeft = 3000;
     doorLight.shadowCameraRight = 3000;
     */
    doorLight.shadowCameraRight = 0.2;
    doorLight.shadowCameraLeft = -0.2;
    doorLight.shadowCameraTop = 1;
    doorLight.shadowCameraBottom = -1;
    doorLight.shadowCameraVisible = true;
    doorLight.shadowDarkness = 0.5;
    doorLight.distance = 0;
    //doorLight.shadowCamera.updateProjectionMatrix();


    scene.add(doorLight);
    ////////////

    // PARTICLES
    /*var particles = new THREE.Geometry;
     for (var p = 0; p < 100; p++) {
     var particle = new THREE.Vector3(Math.random()+doorLight.position.x, Math.random()+doorLight.position.y, Math.random()+doorLight.position.z);
     particles.vertices.push(particle);
     var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 2 });
     var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
     
     scene.add(particleSystem);
     }*/


    var sphereGeometry = new THREE.SphereGeometry(0.25, 20, 20);
    var darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000});

    var wireframeMaterial = new THREE.MeshBasicMaterial(
            {color: 0xffff00, wireframe: true, transparent: true});
    var sphere = THREE.SceneUtils.createMultiMaterialObject(
            sphereGeometry, [darkMaterial, wireframeMaterial]);
    sphere.position.x = doorLight.position.x;
    sphere.position.y = doorLight.position.y;
    sphere.position.z = doorLight.position.z;
    scene.add(sphere);

    // cone - truncated

    // radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
    cylinder = new THREE.CylinderGeometry(0.25, 0.6, 3, 20, 4);
    var material = new THREE.MeshPhongMaterial({color: 0xffffff});
    var cylinderMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xffff99),
        transparent: true,
        opacity: 0.5,
    });
    light_cone = new THREE.Mesh(cylinder, material);

    light_cone.position.set(doorLight.position.x, doorLight.position.y, doorLight.position.z);


    //scene.add(light_cone);




    var sphereGeometryT = new THREE.SphereGeometry(0.25, 20, 20);

    var sphereT = new THREE.Mesh(sphereGeometryT, new THREE.MeshLambertMaterial({color: 0xffffff}));
    sphereT.position.x = doorLight.position.x - 4;
    sphereT.position.y = doorLight.position.y - 1;
    sphereT.position.z = doorLight.position.z;
    sphereT.castShadow = true;
    sphereT.receiveShadow = true;
    scene.add(sphereT);
}


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

    light_placing();




    // CAMERA
    // parametri: FOV, widht, height, near, far
    // Imposto un valore di near molto + basso, in modo da evitare l'effetto del culling prima della collisione con il corpo rigido
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 100000);
    camera.position.x = 1;
    camera.position.y = 2.5;
    camera.position.z = 1;


    // RENDERER
    // setting per il rendering della finestra
    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setClearColor(0x6699ff, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    document.body.appendChild(renderer.domElement);
    /////////////////////


    //CONTROLLI
    controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = MOVESPEED;
    controls.lookSpeed = LOOKSPEED;
    controls.lookVertical = false; // Temporary solution; play on flat surfaces only
    controls.noFly = true;

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);


    // click to grab objects
    $(document).click(function (e) {
        e.preventDefault;

        if (e.which == 1 && inventario.length >= 1) {
            inventario[0].position.x = 3;
            inventario[0].position.y = 1.5;
            inventario[0].position.z = 3;
            inventario.pop(inventario[0]);
            oggetti = oggetti - 1;
            $('#oggetti').html(oggetti);
            console.log("inserito oggetto");

        }
        else {
            if (e.which == 1) { // Left click only
                raycaster.setFromCamera(mouse, camera);
                intersections = raycaster.intersectObjects(oggettiPrendibili);

                if (intersections.length > 0) {

                    intersected = intersections[ 0 ].object;
                    var distance = intersections[0].distance;

                    if (intersected && distance < 3) {
                        //removeElement(intersected);
                        intersected.position.x = 100;
                        intersected.position.y = 100;
                        intersected.position.z = 100;
                        inventario.push(intersected);
                        oggetti = oggetti + 1;
                        $('#oggetti').html(oggetti);
                    }
                    console.log("preso oggetto");


                }

            }
        }





    });

    var wallMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('textures/wall.png'), color: 0xffffff, side: THREE.DoubleSide});
    // 
// PIANO - MESH
    // dimensioni del piano
    var side_plane = 100
    var height_plane = 2;

    planeGeometry = new THREE.BoxGeometry(side_plane, height_plane, side_plane);
    planeMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('textures/ground.jpg'), color: 0xffffff});
    // parametri di applicazione della texture (al momento non approfondire)
    planeMaterial.map.repeat.x = 10;
    planeMaterial.map.repeat.y = 10;
    planeMaterial.map.wrapS = THREE.RepeatWrapping;
    planeMaterial.map.wrapT = THREE.RepeatWrapping;
    // creo la mesh
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // la aggiungo alla scena
    scene.add(plane);

    //Prova Mausoleo
    // Mura esterne
    var MuraEsterneGeometry = drawMuraEsterne(0, 0, 0, 15, 5, 15);
    var MuraEsterneMaterial = new THREE.MeshBasicMaterial({color: 0xF6831E, side: THREE.DoubleSide});
    var MuraEsterne = new THREE.Mesh(MuraEsterneGeometry, MuraEsterneMaterial);
    MuraEsterne.position.y = 1;
    scene.add(MuraEsterne);
    mura.push(MuraEsterne);

    //Mura interne
    var MuraInterneGeometry = drawMuraInterne(5, 0, 5, 10, 5, 10);
    var squareMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
    var MuraInterne = new THREE.Mesh(MuraInterneGeometry, squareMaterial);
    MuraInterne.position.y = 1;
    scene.add(MuraInterne);
    mura.push(MuraInterne);

    var MuroConPortaGeometry = drawMuroConPorta3D();
    //MuraConPorta Orizzontale 1
    var Porta1 = new THREE.Mesh(MuroConPortaGeometry, wallMaterial);
    Porta1.position.x = 0.8;
    Porta1.position.y = 3.5;
    Porta1.position.z = 7.5;
    Porta1.castShadow = true;
    scene.add(Porta1);
    mura.push(Porta1);

    //MuraConPorta Orizzontale 2
    var Porta2 = new THREE.Mesh(MuroConPortaGeometry, new THREE.MeshBasicMaterial({color: 0x0000ff}));
    Porta2.position.x = 10.8;
    Porta2.position.y = 3.5;
    Porta2.position.z = 7.5;
    scene.add(Porta2);
    mura.push(Porta2);

    //MuraConPorta Verticale 1
    var Porta3 = new THREE.Mesh(MuroConPortaGeometry, new THREE.MeshBasicMaterial({color: 0x0000ff}));
    //Porta3.position.x = 0.8;
    Porta3.rotation.y = -Math.PI / 2;
    Porta3.position.x = 7.5;
    Porta3.position.y = 3.5;
    Porta3.position.z = 0.8;
    scene.add(Porta3);
    mura.push(Porta3);

    //MuraConPorta Verticale 2
    var Porta4 = new THREE.Mesh(MuroConPortaGeometry, new THREE.MeshBasicMaterial({color: 0x0000ff}));
    //Porta3.position.x = 0.8;
    Porta4.rotation.y = -Math.PI / 2;
    Porta4.position.x = 7.5;
    Porta4.position.y = 3.5;
    Porta4.position.z = 10.8;
    scene.add(Porta4);
    mura.push(Porta4);

    //Porta
    var Porta_ChiusaGeometry = new THREE.BoxGeometry(0.2, 3, 1.8);
    Porta_Chiusa = new THREE.Mesh(Porta_ChiusaGeometry, new THREE.MeshLambertMaterial({color: 0x987654}));
    //Porta_Chiusa = new THREE.Mesh(Porta_ChiusaGeometry, wallMaterial);

    Porta_Chiusa.position.x = 9.83;
    Porta_Chiusa.position.y = 2.5;
    Porta_Chiusa.position.z = 8.64;
    scene.add(Porta_Chiusa);
    Porta_Chiusa.receiveShadow = true;
    Porta_Chiusa.castShadow = true;
    mura.push(Porta_Chiusa);
    doorLight.target = Porta_Chiusa;
    orientate_cone();
    //scene.add(doorLight.target);

    // Health cube
    healthcube = new THREE.Mesh(
            new THREE.BoxGeometry(.5, .5, .5),
            new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/health.png')}));
    healthcube.position.set(3, 1.5, 3);
    oggettiPrendibili.push(healthcube);
    mura.push(healthcube);
    scene.add(healthcube);

}


function onDocumentMouseMove(e) {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}




function removeElement(obj) {
    //obj.geometry.dispose();
    scene.remove(obj);
    mura.pop(obj);
    oggettiPrendibili.pop(obj);
    animate();
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    // chiamo la funzione di rendering
    render();

}
/////////////////

function drawMuraEsterne(x1, y1, z1, x2, y2, z2)
{
    var square = new THREE.Geometry();

    square.vertices.push(new THREE.Vector3(x1, y1, z1));//0
    square.vertices.push(new THREE.Vector3(x2, y1, z1));//1
    square.vertices.push(new THREE.Vector3(x2, y2, z1));//2
    square.vertices.push(new THREE.Vector3(x1, y2, z1));//3

    square.vertices.push(new THREE.Vector3(x1, y1, z2));//4
    square.vertices.push(new THREE.Vector3(x1, y2, z2));//5

    square.vertices.push(new THREE.Vector3(x2, y2, z2));//6
    square.vertices.push(new THREE.Vector3(x2, y1, z2));//7
    //Faccia Nord
    square.faces.push(new THREE.Face3(0, 1, 2)); // Face4 non esiste più
    square.faces.push(new THREE.Face3(0, 2, 3));
    //Faccia Ovest
    square.faces.push(new THREE.Face3(0, 3, 4));
    square.faces.push(new THREE.Face3(3, 4, 5));
    //Faccia Sud
    square.faces.push(new THREE.Face3(4, 5, 6));
    square.faces.push(new THREE.Face3(4, 6, 7));
    //Faccia Est
    square.faces.push(new THREE.Face3(6, 7, 1));
    square.faces.push(new THREE.Face3(6, 1, 2));
    return square;
}

function drawMuraInterne(x1, y1, z1, x2, y2, z2)
{
    var square = new THREE.Geometry();

    square.vertices.push(new THREE.Vector3(x1, y1, z1));//0
    square.vertices.push(new THREE.Vector3(x2, y1, z1));//1
    square.vertices.push(new THREE.Vector3(x2, y2, z1));//2
    square.vertices.push(new THREE.Vector3(x1, y2, z1));//3

    square.vertices.push(new THREE.Vector3(x1, y1, z2));//4
    square.vertices.push(new THREE.Vector3(x1, y2, z2));//5

    square.vertices.push(new THREE.Vector3(x2, y2, z2));//6
    square.vertices.push(new THREE.Vector3(x2, y1, z2));//7

    square.vertices.push(new THREE.Vector3(x2, y1, z1 + 4.5));//8
    square.vertices.push(new THREE.Vector3(x2, y1 + 3, z1 + 4.5));//9
    square.vertices.push(new THREE.Vector3(x2, y2, z1 + 4.5));//10
    square.vertices.push(new THREE.Vector3(x2, y1, z1 + 3));//11
    square.vertices.push(new THREE.Vector3(x2, y1 + 3, z1 + 3));//12
    square.vertices.push(new THREE.Vector3(x2, y2, z1 + 3));//13

    //Faccia Nord
    square.faces.push(new THREE.Face3(0, 1, 2));
    square.faces.push(new THREE.Face3(0, 2, 3));
    //Faccia Ovest
    square.faces.push(new THREE.Face3(0, 3, 4));
    square.faces.push(new THREE.Face3(3, 4, 5));
    //Faccia Sud
    square.faces.push(new THREE.Face3(4, 5, 6));
    square.faces.push(new THREE.Face3(4, 6, 7));
    //Faccia Est

    square.faces.push(new THREE.Face3(6, 7, 8));
    square.faces.push(new THREE.Face3(6, 8, 10));
    square.faces.push(new THREE.Face3(10, 9, 12));
    square.faces.push(new THREE.Face3(10, 12, 13));
    square.faces.push(new THREE.Face3(13, 11, 1));
    square.faces.push(new THREE.Face3(13, 1, 2));

    return square;
}

function drawMuroConPorta3D()
{
    var stipiteDestro = new THREE.BoxGeometry(1.59, 5, 0.4);
    var material = new THREE.MeshBasicMaterial( );
    var sDmesh = new THREE.Mesh(stipiteDestro, material);
    sDmesh.position.x = 3.4;

    var traversa = new THREE.BoxGeometry(1.82, 2, 0.4);
    var tMesh = new THREE.Mesh(traversa, material);
    tMesh.position.x = 1.7;
    tMesh.position.y = 1.5;

    var muro = new THREE.BoxGeometry(1.59, 5, 0.4);
    THREE.GeometryUtils.merge(muro, tMesh);
    THREE.GeometryUtils.merge(muro, sDmesh);

    return muro;
}

function apriPorta() {
    if (porta == false) {
        console.log("apro porta");
        Porta_Chiusa.position.y = 100;
        porta = true;
    } else {
        console.log("chiudo porta");
        Porta_Chiusa.position.y = 2.5;
        porta = false;
    }
}


// LOOP RENDERING
// chiamo una funzione animate, che si occupa di richiedere un nuovo frame, di gestire gli update delle librerie e controlli, e poi di chiamare la funzione di rendering
function animate()
{
    // richiedo un frame di rendering
    requestAnimationFrame(animate);
    // aggiorno la camerada

    // chiamo la funzione di rendering
    render();
}

// funzione di rendering
function render()
{
    var delta = clock.getDelta(), speed = delta * MOVESPEED;
    controls.update(delta); // Move camera
    renderer.render(scene, camera);
}
			