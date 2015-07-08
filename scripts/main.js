
/* global THREE */

// controlla il supporto a WebGL (se la scheda grafica non lo supporta viene mostato un messaggio d'errore)
//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


var container;

// variabili globali per la scena, il renderer ecc
var scene, renderer;

// variabili per il "prato"
var planeGeometry, planeMaterial;

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
var mouse = {x: 0, y: 0};

var doorLight;
oggettiPrendibili = [];
var inventario = [];
var oggetti = 0, mura;
mura = [];

//GEOMETRY
var cylinder;

//MESH
var light_cone;
var plane;
var MuraEsterne, MuraInterne;
var Porta1, Porta2, Porta3, Porta4;
//MATERIALS
var wall_material;

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


function loadMaterial(material)
{
    MuraEsterne.material = material;
    MuraInterne.material = material;
    Porta1.material = material;
    Porta2.material = material;
    Porta3.material = material;
    Porta4.material = material;
    alert(doorLight.position);
}

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
        if (e.which === 1) { // Left click only
            raycaster.setFromCamera(mouse, camera);
            intersections = raycaster.intersectObjects(oggettiPrendibili);
            if (intersections.length > 0) {

                intersected = intersections[ 0 ].object;
                var distance = intersections[0].distance;
                if (intersected && distance < 2) {
                    scene.remove(intersected);
                    oggetti = oggetti + 1;
                    $('#oggetti').html(oggetti);
                }



            }
        }
    });




    var wall_material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('textures/wall.png'), color: 0xffffff});


    // posiziono il cubo al centro
    //cubeMesh.position.x = +20;
    /*wall_material.map.repeat.x = 2;
     wall_material.map.repeat.y = 2;
     wall_material.map.wrapS = THREE.RepeatWrapping;
     wall_material.map.wrapT = THREE.RepeatWrapping;*/


    // PIANO - MESH
    // dimensioni del piano
    var side_plane = 15;
    var height_plane = 2;
    planeGeometry = new THREE.BoxGeometry(side_plane, height_plane, side_plane);
    planeMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('textures/wall.png'), color: 0xffffff});

    // parametri di applicazione della texture (al momento non approfondire)
    planeMaterial.map.repeat.x = 20;
    planeMaterial.map.repeat.y = 20;
    planeMaterial.map.wrapS = THREE.RepeatWrapping;
    planeMaterial.map.wrapT = THREE.RepeatWrapping;

    // creo la mesh
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(7.5, 0, 7.5);
    //plane.position.set(0,5,0);
    //plane.rotation.z = -Math.PI;
    // la aggiungo alla scena
    scene.add(plane);
    //Prova Mausoleo
    // Mura esterne
    var MuraEsterneGeometry = drawMura(15, 5, 15, false);
    var MuraEsterneMaterial = new THREE.MeshBasicMaterial({color: 0xF6831E});
    MuraEsterne = new THREE.Mesh(MuraEsterneGeometry, wall_material);
    MuraEsterne.position.x = 7.5;
    MuraEsterne.position.y = 3.5;
    scene.add(MuraEsterne);
    mura.push(MuraEsterne);
    //Mura interne
    var MuraInterneGeometry = drawMura(5, 5, 5, true);
    var MuraInterneMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
    MuraInterne = new THREE.Mesh(MuraInterneGeometry, wall_material);
    MuraInterne.position.x = 7.5;
    MuraInterne.position.y = 3.5;
    MuraInterne.position.z = 5;
    scene.add(MuraInterne);
    mura.push(MuraInterne);


    var MuroConPortaGeometry = drawMuroConPorta3D(1.59, 1.82, 1.59, 0.4);
    //MuraConPorta Orizzontale 1 = PORTA A DESTRA
    Porta1 = new THREE.Mesh(MuroConPortaGeometry, wall_material);
    Porta1.position.x = 0.8;
    Porta1.position.y = 3.5;
    Porta1.position.z = 7.5;
    scene.add(Porta1);
    mura.push(Porta1);

    // PIAZZAMENTO LUCI TORCE PORTA A DESTRA
    pointLightGenerator(Porta1.position.x, Porta1.position.z - torch_distance);
    pointLightGenerator(Porta1.position.x + 1.82 + 1.59, Porta1.position.z - torch_distance);
    pointLightGenerator(Porta1.position.x, Porta1.position.z + torch_distance);
    pointLightGenerator(Porta1.position.x + 1.82 + 1.59, Porta1.position.z + torch_distance);

    //MuraConPorta Orizzontale 2 = PORTA FARETTO
    Porta2 = new THREE.Mesh(MuroConPortaGeometry, wall_material);
    Porta2.position.x = 10.8;
    Porta2.position.y = 3.5;
    Porta2.position.z = 7.5;
    scene.add(Porta2);
    mura.push(Porta2);

    // PIAZZAMENTO LUCI TORCE PORTA 2  (QUELLA CON IL FARETTO)
    pointLightGenerator(Porta2.position.x, Porta2.position.z - torch_distance);
    pointLightGenerator(Porta2.position.x + 1.82 + 1.59, Porta2.position.z - torch_distance);

    //MuraConPorta Verticale 1
    Porta3 = new THREE.Mesh(MuroConPortaGeometry, wall_material);
    //Porta3.position.x = 0.8;
    Porta3.rotation.y = -Math.PI / 2;
    Porta3.position.x = 7.5;
    Porta3.position.y = 3.5;
    Porta3.position.z = 0.8;
    scene.add(Porta3);
    mura.push(Porta3);

    // PIAZZAMENTO LUCI TORCE PORTA 3
    pointLightGenerator(Porta3.position.x - torch_distance, Porta3.position.z);
    pointLightGenerator(Porta3.position.x - torch_distance, Porta3.position.z + (1.82 + 1.59));
    pointLightGenerator(Porta3.position.x + torch_distance, Porta3.position.z);
    pointLightGenerator(Porta3.position.x + torch_distance, Porta3.position.z + (1.82 + 1.59));

    //MuraConPorta Verticale 2
    Porta4 = new THREE.Mesh(MuroConPortaGeometry, wall_material);
    //Porta3.position.x = 0.8;
    Porta4.rotation.y = -Math.PI / 2;
    Porta4.position.x = 7.5;
    Porta4.position.y = 3.5;
    Porta4.position.z = 10.8;
    scene.add(Porta4);
    mura.push(Porta4);


    // PIAZZAMENTO LUCI TORCE PORTA 3
    pointLightGenerator(Porta4.position.x - torch_distance, Porta4.position.z);
    pointLightGenerator(Porta4.position.x - torch_distance, Porta4.position.z + (1.82 + 1.59));
    pointLightGenerator(Porta4.position.x + torch_distance, Porta4.position.z);
    pointLightGenerator(Porta4.position.x + torch_distance, Porta4.position.z + (1.82 + 1.59));

    //Porta
    var Porta_ChiusaGeometry = new THREE.BoxGeometry(0.2, 3, 1.8);
    //Porta_Chiusa = new THREE.Mesh(Porta_ChiusaGeometry, new THREE.MeshBasicMaterial({color: 0xff00ff}));
    Porta_Chiusa = new THREE.Mesh(Porta_ChiusaGeometry, wall_material);
    Porta_Chiusa.position.x = 9.88;
    Porta_Chiusa.position.y = 2.5;
    Porta_Chiusa.position.z = 8.8;
    scene.add(Porta_Chiusa);
    mura.push(Porta_Chiusa);

    // Health cube
    healthcube = new THREE.Mesh(
            new THREE.BoxGeometry(.5, .5, .5),
            new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/health.png')}));
    healthcube.position.set(3, 1.5, 3);
    oggettiPrendibili.push(healthcube);
    mura.push(healthcube);
    scene.add(healthcube);
    spotLightPlacing();
    cook_torrance();
    //orientate_cone();
}


function onDocumentMouseMove(e) {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
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

function drawMura(x1, y1, z1, brick)
{

    var transformMatrix = new THREE.Matrix4();
    var muro = new THREE.BoxGeometry(x1, y1, 0.01);
    var MuroOvest = new THREE.BoxGeometry(0.01, y1, z1);
    transformMatrix.makeTranslation(-x1 / 2, 0, z1 / 2);
    MuroOvest.applyMatrix(transformMatrix);
    var MuroEst;
    if (brick)
    {
        //con una Matrix4 posso applicare le trasformazioni direttamente alla geometria
        transformMatrix.makeTranslation(3.3, 0, 0);
        var stipiteDestro = new THREE.BoxGeometry(3.05, 5, 0.01);
        stipiteDestro.applyMatrix(transformMatrix);
        //1.5 = metà altezza porta, perchè??? boh
        transformMatrix.makeTranslation(0.975, 1.5, 0);
        var traversa = new THREE.BoxGeometry(1.6, 2, 0.01);
        traversa.applyMatrix(transformMatrix);
        MuroEst = new THREE.BoxGeometry(0.35, 5, 0.01);
        MuroEst.merge(traversa);
        MuroEst.merge(stipiteDestro);
        transformMatrix.makeRotationY(Math.PI / 2);
        MuroEst.applyMatrix(transformMatrix);
        transformMatrix.makeTranslation(x1 / 2, 0, 4.825);
        MuroEst.applyMatrix(transformMatrix);
    }
    else
    {
        MuroEst = new THREE.BoxGeometry(0.01, y1, z1);
        transformMatrix.makeTranslation(x1 / 2, 0, z1 / 2);
        MuroEst.applyMatrix(transformMatrix);
    }


    var MuroSud = new THREE.BoxGeometry(x1, y1, 0.01);
    transformMatrix.makeTranslation(0, 0, z1);
    MuroSud.applyMatrix(transformMatrix);
    muro.merge(MuroSud);
    muro.merge(MuroEst);
    muro.merge(MuroOvest);
    return muro;
}

function drawMuraInterne(x1, y1, z1, x2, y2, z2)
{
    var square = new THREE.Geometry();
    square.vertices.push(new THREE.Vector3(x1, y1, z1)); //0
    square.vertices.push(new THREE.Vector3(x2, y1, z1)); //1
    square.vertices.push(new THREE.Vector3(x2, y2, z1)); //2
    square.vertices.push(new THREE.Vector3(x1, y2, z1)); //3

    square.vertices.push(new THREE.Vector3(x1, y1, z2)); //4
    square.vertices.push(new THREE.Vector3(x1, y2, z2)); //5

    square.vertices.push(new THREE.Vector3(x2, y2, z2)); //6
    square.vertices.push(new THREE.Vector3(x2, y1, z2)); //7

    square.vertices.push(new THREE.Vector3(x2, y1, z1 + 4.5)); //8
    square.vertices.push(new THREE.Vector3(x2, y1 + 3, z1 + 4.5)); //9
    square.vertices.push(new THREE.Vector3(x2, y2, z1 + 4.5)); //10
    square.vertices.push(new THREE.Vector3(x2, y1, z1 + 3)); //11
    square.vertices.push(new THREE.Vector3(x2, y1 + 3, z1 + 3)); //12
    square.vertices.push(new THREE.Vector3(x2, y2, z1 + 3)); //13

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

//sD, tr, sS = lunghezza stipite Destro, traversa, stipiteSinistro
//sp = spessore mesh
function drawMuroConPorta3D(sS, tr, sD, sp)
{
    var transformMatrix = new THREE.Matrix4();
    //con una Matrix4 posso applicare le trasformazioni direttamente alla geometria
    transformMatrix.makeTranslation(sS + tr - 0.01, 0, 0);
    var stipiteDestro = new THREE.BoxGeometry(sD, 5, sp);
    stipiteDestro.applyMatrix(transformMatrix);
    //1.5 = metà altezza porta, perchè??? boh
    transformMatrix.makeTranslation(sS + 0.11, 1.5, 0);
    var traversa = new THREE.BoxGeometry(tr, 2, sp);
    traversa.applyMatrix(transformMatrix);
    var muro = new THREE.BoxGeometry(sS, 5, sp);
    muro.merge(traversa);
    muro.merge(stipiteDestro);
    return muro;
}

function ApriLaPorta()
{
    console.log("Apro la Porta");
    controls.apriPorta = false;
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
    if (controls.apriPorta)
        ApriLaPorta();
    var delta = clock.getDelta(), speed = delta * MOVESPEED;
    controls.update(delta); // Move camera
    renderer.render(scene, camera);
}

			