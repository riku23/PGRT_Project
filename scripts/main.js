
/* global torchNO1, torchNO2, SORum, torchSO1, torchSO2, NORum, SERum, NERum, torchNO3, torchNO4, THREE, flame */

// controlla il supporto a WebGL (se la scheda grafica non lo supporta viene mostato un messaggio d'errore)
//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

// variabili globali per la scena, il renderer ecc
var scene, renderer;
var istruzioni = "Movimento: Tasti W/A/S/D\nVisuale: Movimento mouse\nRaccogli e posiziona oggetti: Tasto destro mouse\nRipristina livello: Tasto R\nIstruzioni: Tasto I\n";

var raycaster = new THREE.Raycaster();
// variabili per la camera
var camera, controls,
        MOVESPEED = 5,
        LOOKSPEED = 0.08;
var spawnX = 14, spawnY = 3, spawnZ = 12;
var RISOLTO;
var oggettoFaro;
var oldX, oldY, oldZ;
var filtri;
var livello;
var mouse = {x: 0, y: 0}
var oggettiPrendibili = [];
var inventario;
var inventarioPos;
var oggetti;
var mura = [];
var tentativi;
var tween;
var abilitaMovimento = false;

// variabile per la gestione del frustum culling
var frustum;




//MESH
var light_cone;
var plane;
var MuraEsterne, MuraInterne;
var PortaN, PortaS, PortaO, PortaE;
var faro;
var filtroRisultato, filtroRosso, filtroRosso2, fitroGiallo, filtroGiallo2, filtroBlu, filtroBlu2, filtroSaturazione;
var tavoloSE, tavoloNO, tavoloNE, tavoloSO;
var torciaNE1, torciaNE2, torciaNE3, torciaNE4;
var torciaNO1, torciaNO2, torciaNO3, torciaNO4;
var torciaNO1, torciaSE2, torciaSE3, torciaSE4;
var torciaSO3, torciaSO4;
var mesh;
var Porta_Chiusa;
var light_cone;
var material;
//MATERIALS
var wall_material;

var PortaN = new THREE.Vector3(0.8, 3.5, 7.5);
var PortaS = new THREE.Vector3(10.8, 3.5, 7.5);
var PortaE = new THREE.Vector3(7.5, 3.5, 0.8);
var PortaO = new THREE.Vector3(7.5, 3.5, 10.8);

var sphere_test;



//SOUNDS
var bgAudio, itemAudio, doorAudio, portalAudio, stepsAudio;


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

function setDefaultVariables(livello, filtri) {
    //SETUP VARIABILI
    this.livello = livello;
    tentativi = 1;
    this.filtri = filtri;
    RISOLTO = false;
    inventario = [];
    oggetti = 0;
    inventarioPos = 0;
}







// INIZIALIZZAZIONE
//Funzioni di inizializzazione della scena
function init()
{



    //SOUNDS
    bgAudio = new Audio('sounds/bg.wav');
    bgAudio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    bgAudio.play();
    doorAudio = new Audio('sounds/door.wav');
    itemAudio = new Audio('sounds/pick.wav');
    portalAudio = new Audio('sounds/warp.wav');
    stepsAudio = new Audio('sounds/steps2.wav');
    stepsAudio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);



    // SCENE
    // creo una istanza della classe Scene (radice del grafo della scena che avrÃ  come nodi i modelli, luce, ecc della scena)
    scene = new THREE.Scene();
    ////////////

    // Set up "hurt" flash
    $('body').append('<div id="hurt"></div>');
    $('#hurt').css({width: window.innerWidth, height: window.innerHeight, });


    // CAMERA
    // parametri: FOV, widht, height, near, far
    // Imposto un valore di near molto + basso, in modo da evitare l'effetto del culling prima della collisione con il corpo rigido
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 100);
    camera.rotation.y = Math.PI / 2;
    camera.position.x = spawnX;
    camera.position.y = spawnY;
    camera.position.z = spawnZ;


    // FRUSTUM
    // creo una istanza della classe Frustum
    frustum = new THREE.Frustum();
    ////////////

    //VARIABILI
    setDefaultVariables(1, 1);

    //HUD
    setupHUD();
    document.getElementById("inventory1").style.border = "1px solid #E4AE6E";

    // RENDERER
    // setting per il rendering della finestra
    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setClearColor(0x6699ff, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    document.body.appendChild(renderer.domElement);
    /////////////////////


    //CONTROLLI
    controls = new THREE.FirstPersonControls(camera, document);
    controls.movementSpeed = MOVESPEED;
    controls.lookSpeed = LOOKSPEED;

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    //setto l'ambiente con mura esterne, interne, di passaggio, piano 
    set_ambient();
    createFiltri();
    set_ambient_items();
    setFiltri(livello);
    spotLightDoor();

    //PARTICLE SYSTEM
    //Inizializzo un particle group al quale legare poi i diversi emitter

    // Create a particle group to add the emitter to.
    this.particleGroupFlame = new SPE.Group({
        // Give the particles in this group a texture
        texture: THREE.ImageUtils.loadTexture('images/smokeparticle.png'),
        // How long should the particles live for? Measured in seconds.
        maxAge: 0.3
    });
    scene.add(particleGroupFlame.mesh);

    this.particleGroupFog = new SPE.Group({
        texture: THREE.ImageUtils.loadTexture('images/cloudSml.png'),
        maxAge: 10
    });

    scene.add(particleGroupFog.mesh);


    fogGenerator();

    //piazza le pointlight per le torce
    torchLight();


    //carico shader per mura

    applyCookTorrance(26, 1.6, diffuseColor.setRGB(255 / 255, 94 / 255, 0));

}


// FUNZIONE DI PICKING
$(document).click(function (e) {
    e.preventDefault;

    raycaster.setFromCamera(mouse, camera);
    intersections = raycaster.intersectObjects(oggettiPrendibili);

    if (e.which == 1 && RISOLTO == false) {

        if (intersections.length > 0) {
            //inventario libero
            intersected = intersections[ 0 ].object;
            var distance = intersections[0].distance;
            if (intersected.name == "saturazione") {
                if (inventario[2] != null) {
                    return;
                }
                inventario[2] = filtroSaturazione;
                intersected.position.x = 100;
                intersected.position.y = 100;
                intersected.position.z = 100;
                document.getElementById("inventory3").style.backgroundColor = "#" + intersected.material.color.getHexString();
                itemAudio.play();
            } else {
                if (intersected && intersected != faro && distance < 3 && inventarioPos != 2) {

                    //prendo l'oggetto
                    if (inventario[inventarioPos] == null) {
                        if (intersected == oggettoFaro) {
                            light_cone.material.uniforms.lightColor.value.set(0xffffff);
                            oggettoFaro = null;
                        }
                        inventario[inventarioPos] = intersected;
                        intersected.position.x = 100;
                        intersected.position.y = 100;
                        intersected.position.z = 100;

                        var realIndex = inventarioPos + 1;
                        console.log("#" + intersected.material.color.getHexString());
                        document.getElementById("inventory" + realIndex.toString()).style.backgroundColor = "#" + intersected.material.color.getHexString();
                        //document.getElementById("inventory" + realIndex.toString()).style.backgroundImage = "url(textures/inventario/" + intersected.name + ".jpg)"
                        itemAudio.play();

                    } else {
                        if (intersected == oggettoFaro && inventarioPos != 2) {

                            light_cone.material.uniforms.lightColor.value.set(inventario[inventarioPos].material.color);
                            oggettoFaro = inventario[inventarioPos];
                            checkFaro();
                        }
                        inventario[inventarioPos].position.x = intersected.position.x;
                        inventario[inventarioPos].position.y = intersected.position.y;
                        inventario[inventarioPos].position.z = intersected.position.z;
                        inventario[inventarioPos].rotation.y = intersected.rotation.y;
                        intersected.position.x = 100;
                        intersected.position.y = 100;
                        intersected.position.z = 100;
                        inventario[inventarioPos] = intersected;
                        var realIndex = inventarioPos + 1;
                        document.getElementById("inventory" + realIndex.toString()).style.backgroundColor = "#" + intersected.material.color.getHexString();
                        itemAudio.play();

                    }
                } else {
                    if (inventario[inventarioPos] != null && intersected && intersected == faro && distance < 3 && oggettoFaro == null && inventarioPos != 2) {
                        //se interseco il faro posiziono l'oggetto in inventario su di esso
                        var color = inventario[inventarioPos].material.color;
                        var texture = inventario[inventarioPos].material.map;
                        inventario[inventarioPos].material = new THREE.MeshBasicMaterial({map: texture, color: color});
                        inventario[inventarioPos].position.x = faro.position.x - 0.3;
                        inventario[inventarioPos].position.y = faro.position.y + 1.24;
                        inventario[inventarioPos].position.z = faro.position.z + 0.03;
                        inventario[inventarioPos].rotation.y = 0;
                        oggettoFaro = inventario[inventarioPos];
                        inventario[inventarioPos] = null;
                        var realIndex = inventarioPos + 1;
                        light_cone.material.uniforms.lightColor.value.set(oggettoFaro.material.color);
                        document.getElementById("inventory" + realIndex.toString()).style.backgroundColor = "";
                        checkFaro();
                        itemAudio.play();
                    }

                }
            }
        }
    }
});




function onDocumentMouseMove(e) {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}


function checkFaro() {
    if (oggettoFaro.material.color.getHex() == Porta_Chiusa.material.color.getHex()) {
        setDoorAnimation();
    } else {
        //tentativi = tentativi - 1;

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
    renderer.setSize(window.innerWidth, window.innerHeight);
    // chiamo la funzione di rendering
    render();

}

function setDoorAnimation() {

    doorAudio.play();
    //posizione iniziale
    var position = {z: Porta_Chiusa.position.z};
    //posizione finale
    var target = {z: 7};
    //curva usata per l'animazione
    //L'esempio mentiva, ma messe nella creazione direttamente del tween funzionano, queste cose fanno bestemmiare duro
    //var easing = TWEEN.easing(TWEEN.Easing.Quadratic.In);
    //
    //var update = TWEEN.onUpdate(function(){ porta.position.z = position.z});

    tween = new TWEEN.Tween(position).to(target, 3000);
    tween.easing(TWEEN.Easing.Linear.None);
    tween.onUpdate(function () {
        Porta_Chiusa.position.z = position.z
    });

    tween.start();
    RISOLTO = true;
}
var diffuseColor = new THREE.Color();
diffuseColor.setRGB(255 / 255, 94 / 255, 0);
var wallParamLevel = [
    //secondo livello -- viola
    {freq: 26, power: 2,
        colorB: new THREE.Color().setRGB(163 / 255, 0, 128 / 255),
        colorM: new THREE.Color().setRGB(250 / 255, 100 / 255, 196 / 255),
        colorE: new THREE.Color().setRGB(255 / 255, 148 / 255, 255 / 255)},
    //terzo -- verde
    {freq: 10, power: 1.6,
        colorB: new THREE.Color().setRGB(3 / 255, 102 / 255, 0),
        colorM: new THREE.Color().setRGB(60 / 255, 240 / 255, 60 / 255),
        colorE: new THREE.Color().setRGB(127 / 255, 255 / 255, 122 / 255)},
    //quarto -- bianco
    {freq: 30, power: 1.6,
        colorB: new THREE.Color().setRGB(255 / 255, 255 / 255, 255 / 255),
        colorM: new THREE.Color().setRGB(125 / 255, 125 / 255, 125 / 255),
        colorE: new THREE.Color().setRGB(0, 0, 0)},
    //quinto -- blue
    {freq: 20, power: 1.6,
        colorB: new THREE.Color().setRGB(44 / 255, 29 / 255, 180 / 255),
        colorM: new THREE.Color().setRGB(70 / 255, 70 / 255, 231 / 255),
        colorE: new THREE.Color().setRGB(255 / 255, 255 / 255, 255 / 255)}
]

function nuovoLivello(livello) {

    this.livello = livello;
    portalAudio.play();

    camera.rotation.y = Math.PI / 2;
    camera.position.set(spawnX, spawnY, spawnZ);
    //CONTROLLI
    controls = new THREE.FirstPersonControls(camera, document);
    controls.movementSpeed = MOVESPEED;
    controls.lookSpeed = LOOKSPEED;
    var delta = clock.getDelta(), speed = delta * MOVESPEED;
    controls.update(delta); // Move camera
    Porta_Chiusa.position.set(portaX, portaY, portaZ);
    colorePorta(livello);

    light_cone.material.uniforms.lightColor.value.set(0xffffff);
    if (oggettoFaro) {
        oggettoFaro.position.x = 100;
        oggettoFaro.position.y = 100;
        oggettoFaro.position.z = 100;
    }
    oggettoFaro = null;
    setDefaultVariables(livello, filtri); //Dovrei fare livello+1 e filtri+1
    setFiltri(livello);
    svuotaInventario();


    var new_l = livello - 2;
    applyCookTorrance(wallParamLevel[new_l].freq, wallParamLevel[new_l ].power, wallParamLevel[new_l ].colorB);


    flames.forEach(function (flame) {
        flame.colorStart = new THREE.Color(wallParamLevel[new_l ].colorB);
        flame.colorMiddle = new THREE.Color(wallParamLevel[new_l ].colorM);
        flame.colorEnd = new THREE.Color(wallParamLevel[new_l ].colorE);
    });
}

function setupHUD() {


    $('body').append('<div id="backInventory"><div id="inventory1" style="background-image:;  background-size: 100%;"></div><div id="inventory2" style="background-image:;  background-size: 100%;"></div><button id="combine" type="button"></button><div id="inventory3" style="background-image:;  background-size: 100%;"></div></div>');
    document.getElementById("combine").onclick = function () {
        combine()
    };
}


function svuotaInventario() {
    var index;
    if (livello < 3) {
        index = livello;
    } else {
        index = 3
    }
    for (i = 0; i < index; i++) {
        var realIndex = i + 1;
        document.getElementById("inventory" + realIndex.toString()).style.backgroundColor = "";
        inventario[i] = null;
    }

}


function selectInventory() {
    var index;
    if (livello < 3) {
        index = livello;
    } else {
        index = 3
    }

    if (inventarioPos < index) {
        for (i = 0; i < index; i++) {
            var realIndex = i + 1;
            if (i == inventarioPos) {
                document.getElementById("inventory" + realIndex.toString()).style.border = "1px solid #E4AE6E";
            } else {
                document.getElementById("inventory" + realIndex.toString()).style.border = "1px solid black";
            }
        }
    }

}

// LOOP RENDERING
// chiamo una funzione animate, che si occupa di richiedere un nuovo frame, di gestire gli update delle librerie e controlli, e poi di chiamare la funzione di rendering
function animate()
{
    requestAnimationFrame(animate);
    // Gameover
    if (tentativi <= 0) {

        $(renderer.domElement).fadeOut();
        $('#hud,#inventory1,#inventory2,#inventory3,#inventory4,#oggetti,#combine').fadeOut();
        $('#intro').fadeIn();
        $('#intro').html('Darkness consumes you');

    }

    if (RISOLTO && (portaX + 0.1 > camera.position.x && camera.position.x > portaX - 0.5) && (portaZ - 0.9 < camera.position.z && camera.position.z < portaZ + 0.9)) {

        this.livello = this.livello + 1
        filtri = filtri + 1;
        if (livello > 5) {
            $(renderer.domElement).fadeOut();
            $('#hud,#inventory1,#inventory2,#inventory3,#inventory4,#oggetti,#combine').fadeOut();
            $('#intro').fadeIn();
            $('#intro').html('FINE');
            bgAudio.pause();
            return;
        }
        $('#hurt').fadeIn(75);
        $('#hurt').fadeOut(450);
        console.log(this.livello);
        nuovoLivello(this.livello);
    }
    render();
    TWEEN.update();
    var dt = clock.getDelta();
    particleGroupFlame.tick(dt);
    particleGroupFog.tick(dt);
}

// funzione di rendering
function render()
{
    var delta = clock.getDelta(), speed = delta * MOVESPEED;
    controls.update(delta); // Move camera
    renderer.render(scene, camera);
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

    for (var i = 0; i < mura.length; i++) {
        mura[i].visible = frustum.intersectsObject(mura[i]);
    }

}