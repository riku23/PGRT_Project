
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
var faroOk;
var spawnX = 14, spawnY = 3, spawnZ = 12;
var INIBITELO;
var selectedObject, oggettoFaro, oggettoFaroBool;
var oldX, oldY, oldZ;
var filtri;
var mouse = {x: 0, y: 0}
var oggettiPrendibili;
var inventario;
var inventarioPos;
var oggetti;
var mura = [];
var tentativi;
var tween;


// variabile per la gestione del frustum culling
var frustum;

//GEOMETRY
var cylinder;

//MESH
var light_cone;
var plane;
var MuraEsterne, MuraInterne;
var PortaN, PortaS, PortaO, PortaE;
var faro;
var cube1, cube2;
var tavoloSE, tavoloNO, tavoloNE, tavoloSO;
var Porta_Chiusa;

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

function setDefaultVariables() {
    //SETUP VARIABILI
    tentativi = 1;
    oggettoFaroBool = false;
    INIBITELO = false;
    faroOk = false;
    filtri = 2;
    oggettiPrendibili = [];
    inventario = [];
    oggetti = 0;
    inventarioPos= 0;
}






// INIZIALIZZAZIONE
//Funzioni di inizializzazione della scena
function init()
{
    // Display HUD
    $('body').append('<div name="inventario" id="inventory1" style="background-image:; width: 100px; height: 100px; background-size: 100%;"></div>');
    $('body').append('<div name="inventario" id="inventory2" style="background-image:; width: 100px; height: 100px; background-size: 100%;"></div>');
    $('body').append('<div name="inventario" id="inventory3" style="background-image:; width: 100px; height: 100px; background-size: 100%;"></div>');
    $('body').append('<div name="inventario" id="inventory4" style="background-image:; width: 100px; height: 100px; background-size: 100%;"></div>');
    $('body').append('<div id="hud"><p>Oggetti: <span id="oggetti">0</span></p></div>');
    porta = false;
    // SCENE
    // creo una istanza della classe Scene (radice del grafo della scena che avrà come nodi i modelli, luce, ecc della scena)
    scene = new THREE.Scene();
    ////////////


    // CAMERA
    // parametri: FOV, widht, height, near, far
    // Imposto un valore di near molto + basso, in modo da evitare l'effetto del culling prima della collisione con il corpo rigido
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 100000);
    camera.rotation.y = Math.PI / 2;
    camera.position.x = spawnX;
    camera.position.y = spawnY;
    camera.position.z = spawnZ;


    // FRUSTUM
    // creo una istanza della classe Frustum
    frustum = new THREE.Frustum();
    ////////////

    //VARIABILI
    setDefaultVariables();

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


    // FUNZIONE DI PICKING
    $(document).click(function (e) {
        e.preventDefault;

        raycaster.setFromCamera(mouse, camera);
        intersections = raycaster.intersectObjects(oggettiPrendibili);

        if (e.which == 1 && INIBITELO == false) {

            if (intersections.length > 0 && inventario.length < filtri) {
                //inventario libero
                intersected = intersections[ 0 ].object;
                var distance = intersections[0].distance;

                if (intersected && intersected != faro && distance < 3) {
                    //prendo l'oggetto
                    if (oggettoFaro == intersected) {
                        oggettoFaroBool = false;
                    }
                    inventario[inventarioPos] = intersected;
                    inventarioPos
                    intersected.position.x = 100;
                    intersected.position.y = 100;
                    intersected.position.z = 100;
                    selectedObject = intersected;
                    document.getElementById("inventory1").style.backgroundImage = "url(textures/inventario/" + selectedObject.name + ".jpg)"
                    oggetti = oggetti + 1;
                    $('#oggetti').html(oggetti);
                    console.log(inventario.length);
                    console.log("preso oggetto inventario libero");
                }
            } else {
                if (intersections.length > 0 && inventario.length >= filtri) {
                    // inventario pieno
                    intersected = intersections[ 0 ].object;
                    var distance = intersections[0].distance;

                    if (intersected && intersected != faro && distance < 3) {
                        //scambio i due oggetti
                        selectedObject.position.x = intersected.position.x;
                        selectedObject.position.y = intersected.position.y;
                        selectedObject.position.z = intersected.position.z;
                        intersected.position.x = 100;
                        intersected.position.y = 100;
                        intersected.position.z = 100;
                        inventario.pop(selectedObject);
                        inventario.push(intersected);
                        if (oggettoFaroBool) {
                            oggettoFaro = inventario[0];
                            checkFaro();
                        }
                        selectedObject = intersected;
                        document.getElementById("inventory").style.backgroundImage = "url(textures/inventario/" + selectedObject.name + ".jpg)"
                        
                        
                        console.log("scambio oggetti");
                    } else {
                        if (intersected && intersected == faro && distance < 3 && oggettoFaroBool == false) {
                            //se interseco il faro posiziono l'oggetto in inventario su di esso
                            selectedObject.position.x = faro.position.x;
                            selectedObject.position.y = faro.position.y + 2.5;
                            selectedObject.position.z = faro.position.z;
                            inventario.pop(selectedObject);
                            oggettoFaroBool = true;
                            oggettoFaro = selectedObject;
                            document.getElementById("inventory").style.backgroundImage = "";
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


    //setto l'ambiente con mura esterne, interne, di passaggio, piano 
    set_ambient();



    // cube 1
    cube1 = new THREE.Mesh(
            new THREE.BoxGeometry(.5, .5, .5),
            new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/health.png')}));
    cube1.position.set(14, 2.4, 1);
    cube1.name = "croce";
    oggettiPrendibili.push(cube1);
    mura.push(cube1);
    scene.add(cube1);

    //  cube 2
    cube2 = new THREE.Mesh(
            new THREE.BoxGeometry(.5, .5, .5),
            new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/ottone.jpg')}));
    cube2.position.set(1, 2.4, 1);
    cube2.name = "ottone";
    oggettiPrendibili.push(cube2);
    mura.push(cube2);
    scene.add(cube2);


     //  cube 3
    cube3 = new THREE.Mesh(
            new THREE.BoxGeometry(.5, .5, .5),
            new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/steel.jpg')}));
    cube3.position.set(1, 2.4, 14);
    cube3.name = "steel";
    oggettiPrendibili.push(cube3);
    mura.push(cube3);
    scene.add(cube3);



    //FARO

    //creo la mesh prima per averne gi� la posizione da usare in spotLightPlacing()
    faro = new THREE.Mesh();
    faro.position.set(14.45, 1.6, 9);


    var loader = new THREE.JSONLoader();


    loader.load("models/faro2.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('textures/steel.jpg')});
        faro.geometry = geometry;
        faro.material = materials;

        // ruoto il modello di 180° sull'asse Y
        faro.rotation.x = Math.PI / 2;
        faro.rotation.z = Math.PI / 2.5;

        // lo scalo per metterlo in scala con la scena
        faro.scale.set(0.02, 0.02, 0.02);
        mura.push(faro);
        oggettiPrendibili.push(faro);
        geometry.computeBoundingBox();
        scene.add(faro);

    });


    tavoloSE = new THREE.Mesh();
    tavoloSE.position.set(14, 1, 1);


    //TAVOLO Sud-Est
    loader.load("models/tavolo2.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        tavoloSE.geometry = geometry;
        tavoloSE.material = materials;


        // ruoto il modello di 180° sull'asse Y
        tavoloSE.rotation.y = Math.PI;
        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        tavoloSE.scale.set(0.035, 0.035, 0.035);
        mura.push(tavoloSE);
        scene.add(tavoloSE);

    });


    //TAVOLO Nord-Ovest
    tavoloNO = new THREE.Mesh();
    tavoloNO.position.set(1, 1, 14);
    loader.load("models/tavolo.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        tavoloNO.geometry = geometry;
        tavoloNO.material = materials;

        // ruoto il modello di 180° sull'asse Y
        tavoloNO.rotation.y = Math.PI;
        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        tavoloNO.scale.set(0.035, 0.035, 0.035);
        mura.push(tavoloNO);
        scene.add(tavoloNO);

    });

    //TAVOLO Nord-Est
    tavoloNE = new THREE.Mesh();
    tavoloNE.position.set(1, 1, 1);
    loader.load("models/tavolo.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        tavoloNE.geometry = geometry;
        tavoloNE.material = materials;

        // ruoto il modello di 180° sull'asse Y
        tavoloNE.rotation.y = Math.PI;
        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        tavoloNE.scale.set(0.035, 0.035, 0.035);
        mura.push(tavoloNE);
        scene.add(tavoloNE);

    });

    //TAVOLO Sud-Ovest
    //TAVOLO Nord-Est
    tavoloSO = new THREE.Mesh();
    tavoloSO.position.set(14, 1, 14);
    loader.load("models/tavolo.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        tavoloSO.geometry = geometry;
        tavoloSO.material = materials;

        // ruoto il modello di 180° sull'asse Y
        tavoloSO.rotation.y = Math.PI;
        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        tavoloSO.scale.set(0.035, 0.035, 0.035);
        mura.push(tavoloSO);
        scene.add(tavoloSO);
    });
    
    computeShadow(tavoloSO);
    computeShadow(tavoloSE);
    computeShadow(tavoloNO);
    computeShadow(tavoloNE);
    computeShadow(faro);





    //Ho bisogno della posizione del faro per posizionare la spotlight, quindi richiamo la funzione dopo
    //piazzo la luce dal faretto
    spotLightDoor();
    torchLight();
    //carico shader per mura
    cook_torrance();




}




function onDocumentMouseMove(e) {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}



function checkFaro() {
    if (oggettoFaro == cube1) {
        faroOk = true;
        console.log("RISOLTO!")
        setDoorAnimation();
        INIBITELO = true;
    } else {
        tentativi = tentativi - 1;

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

function setDoorAnimation()
{

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
}


function selectInventory(){
    
    if(inventarioPos<filtri){
    console.log(inventarioPos);
    for (i=0; i<filtri; i++) {
        var realIndex = i+1;
        if(i==inventarioPos){
            document.getElementById("inventory"+realIndex.toString()).style.border= "2px solid yellow";
        }else{
            document.getElementById("inventory"+realIndex.toString()).style.border= "1px solid black";
        }}}
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
    TWEEN.update()
}

// funzione di rendering
function render()
{
    var delta = clock.getDelta(), speed = delta * MOVESPEED;
    controls.update(delta); // Move camera
    renderer.render(scene, camera);


    // Death
    if (tentativi <= 0) {

        $(renderer.domElement).fadeOut();
        $('#radar, #hud, #credits').fadeOut();
        $('#intro').fadeIn();
        $('#intro').html('Darkness consumes you');
        $('#intro').one('click', function () {

        });
    }

        // devo assegnare alla mia variabile frustum il volume definito dal frustum della camera fps, ma in coordinate mondo (ossia considerando la camera come un oggetto nella scena, con la sua posizione e orientamento)
        // Per riportare il frustum in coordinate mondo, prendo la matrice di proiezione, e la moltiplico per l'inverso della matrice delle trasformazioni globali applicate alla camera
        frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

        // devo passare tutto l'array dei cubi
        for (var i = 0; i < mura.length; i++) {
            // applico il test di intersezione tra frustum e cubo, sulla base del risultato setto l'oggetto a visibile o invisibile (ossia non lo mando lungo la pipeline)                 
            mura[i].visible = frustum.intersectsObject(mura[i]);
        }
    
    // se il culling è disabilitato
    
}