
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
var Porta_Chiusa;
var spawnX = 14, spawnY = 3, spawnZ = 12;
var cube1, cube2, tavolo1;
var INIBITELO;
var selectedObject, oggettoFaro, oggettoFaroBool;
var oldX, oldY, oldZ;
var filtri;
var mouse = {x: 0, y: 0}
var oggettiPrendibili;
var inventario;
var oggetti;
var mura = [];
var tentativi;
// parametro per lo "zoom" della camera top
var zoom = 0.33;

// variabili per le camere
var cameraTOP;
// helper per la visualizzazione dello stato della cameraFPS
var cameraHelper;

// variabile per la gestione del frustum culling
var frustum;
// variabile per indentificare il caso in cui passo dall'applicazione del frustum culling alla sua disabilitazione. Sarà utilizzata insieme alla GUI per ottimizzare l'impostazione di visibilità di tutti gli oggetti
var fromCulling;

//variabili per la gui
var cullingGui;
// tramite la gui, voglio attivare/disattivare il frustum culling, e alternare tra camera FPS e camera top
var cullingParam = {
    useFrustumCulling: false,
    map: false
};

//GEOMETRY
var cylinder;

//MESH
var light_cone;
var plane;
var MuraEsterne, MuraInterne;
var PortaN, PortaS, PortaO, PortaE;
var faro;

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
    filtri = 1;
    oggettiPrendibili = [];
    inventario = [];
    oggetti = 0;
}






// INIZIALIZZAZIONE
//Funzioni di inizializzazione della scena
function init()
{
    // Display HUD
    $('body').append('<div name="inventario" id="inventory" style="background-image:; width: 100px; height: 100px; background-size: 100%;"></div>');
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

    cameraHelper = new THREE.CameraHelper(camera);
    scene.add(cameraHelper);

    // camera top
    // La camera ortografica mi chiede i 6 piani che delimitano left/right/top/bottom/near/far
    // se uso i parametri di width e heigth della finestra, il frustum ortografico mostrerà tutta la scena.
    // se voglio mostrare solo una parte della scena (in questo caso, la griglia dei cubi), devo limitare le dimensioni del frustum. Lo faccio moltiplicando per un fattore "zoom".
    cameraTop = new THREE.OrthographicCamera(-0.5 * window.innerWidth * zoom, 0.5 * window.innerWidth * zoom, 0.5 * window.innerHeight * zoom, -0.5 * window.innerHeight * zoom, 1, 100);
    cameraTop.position.set(0, 10, 0);
    cameraTop.lookAt(camera.position);

    scene.add(cameraTop);
    ////////////

    // FRUSTUM
    // creo una istanza della classe Frustum
    frustum = new THREE.Frustum();
    ////////////

    // GUI
    // imposto la GUI
    setupGui();

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

            if (intersections.length > 0 && inventario.length == 0) {
                //inventario vuoto
                intersected = intersections[ 0 ].object;
                var distance = intersections[0].distance;

                if (intersected && intersected != faro && distance < 3) {
                    //prendo l'oggetto
                    if (oggettoFaro == intersected) {
                        oggettoFaroBool = false;
                    }
                    inventario.push(intersected);
                    intersected.position.x = 100;
                    intersected.position.y = 100;
                    intersected.position.z = 100;
                    selectedObject = intersected;
                    oggetti = oggetti + 1;
                    document.getElementById("inventory").style.backgroundImage = "url(textures/inventario/" + selectedObject.name + ".jpg)";
                    $('#oggetti').html(oggetti);
                    console.log("preso oggetto inventario vuoto");
                }
            } else {
                if (intersections.length > 0 && inventario.length >= filtri) {
                    // inventario pieno
                    intersected = intersections[ 0 ].object;
                    var distance = intersections[0].distance;

                    if (intersected && intersected != faro && distance < 3) {
                        //scambio i due oggetti
                        inventario[0].position.x = intersected.position.x;
                        inventario[0].position.y = intersected.position.y;
                        inventario[0].position.z = intersected.position.z;
                        intersected.position.x = 100;
                        intersected.position.y = 100;
                        intersected.position.z = 100;
                        selectedObject = intersected;
                        if (oggettoFaroBool) {
                            oggettoFaro = inventario[0];
                            checkFaro();
                        }
                        document.getElementById("inventory").style.backgroundImage = "url(textures/inventario/" + selectedObject.name + ".jpg)";
                        inventario.pop(inventario[0]);
                        inventario.push(intersected);
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
    cube2.position.set(2, 2, 2);
    cube2.name = "ottone";
    oggettiPrendibili.push(cube2);
    mura.push(cube2);
    scene.add(cube2);



    //FARO

    //creo la mesh prima per averne gi� la posizione da usare in spotLightPlacing()
    faro = new THREE.Mesh();
    faro.position.set(14.45, 1.6, 9);


    var loader = new THREE.JSONLoader();


    loader.load("models/faro2.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/steel.jpg')});
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



    //TAVOLO
    loader.load("models/tavolo.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        tavolo1 = new THREE.Mesh(geometry, materials);

        // ruoto il modello di 180° sull'asse Y
        tavolo1.rotation.y = Math.PI;
        // lo posiziono sopra il piano
        tavolo1.position.set(14, 1, 1);
        // lo scalo per metterlo in scala con la scena
        tavolo1.scale.set(0.035, 0.035, 0.035);
        tavolo1.castShadow = true;
        tavolo1.receiveShadow = true;
        mura.push(tavolo1);
        scene.add(tavolo1);

    });

    //Ho bisogno della posizione del faro per posizionare la spotlight, quindi richiamo la funzione dopo
    //piazzo la luce dal faretto
    spotLightDoor();
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
        porta = true;
        INIBITELO = true;
    } else {
        tentativi = tentativi - 1;

    }
}

// CREO L'INTERFACCIA GRAFICA
function setupGui() {

    // Creo e imposto l'interfaccia grafica
    var cullingGui = new dat.GUI();
    // creo un folder per i parametri di frustum culling
    var cullingGuiFolder1 = cullingGui.addFolder('Frustum Culling');
    cullingGuiFolder1.add(cullingParam, 'useFrustumCulling').onChange(function (value) {
        // al cambiare del check, controllo se lo stato attuale era true. In questo caso setto a true il booleano fromCulling. Mi servirà per identificare l'unico caso in cui devo resettare tutti i cubi a visibili.
        if (cullingParam.useFrustumCulling)
            fromCulling = true;

    });
    cullingGuiFolder1.open();

    // creo un folder per i parametri di cambio di camera
    var cullingGuiFolder2 = cullingGui.addFolder('Change camera');
    cullingGuiFolder2.add(cullingParam, 'map');
    cullingGuiFolder2.open();


    // NOTA BENE:
    // se, come in questo caso, la pagina prevede una sezione ("info") in alto, 
    // sorge un problema con il posizionamento in profondità dell'interfaccia.
    // La sezione "info" è impostata a 100, mentre la gui è posizionata a una profondità inferiore, impedendo 
    // cosi' il controllo corretto dell'apertura/chiusura.
    // Soluzioni:
    //	1) posizionare la gui diversamente (es: un poco più in basso)
    //	2) definire una nuova sezione ("gui") definendo un posizionamento in profondità che permetta di avere
    // 		sempre il focus.
    // Di seguito la soluzione 2) 
    customContainer = document.createElement('gui');
    customContainer.style.cssText = "position:absolute;top:0px;right:0px;z-index:110;";
    customContainer.appendChild(cullingGui.domElement);
    document.body.appendChild(customContainer);
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


function nuovoLivello() {
    camera.position.x = spawnX;
    camera.position.y = spawnY;
    camera.position.z = spawnZ;

}

function apriPorta() {
    if (porta == true) {
        console.log("apro porta");
        Porta_Chiusa.position.y = 100;
        porta = false;
    } else {
        console.log("chiudo porta");
        Porta_Chiusa.position.y = 2.5;
        porta = true;
    }
}


// LOOP RENDERING
// chiamo una funzione animate, che si occupa di richiedere un nuovo frame, di gestire gli update delle librerie e controlli, e poi di chiamare la funzione di rendering
function animate()
{
    // richiedo un frame di rendering
    requestAnimationFrame(animate);
    // aggiorno la camerada

    if (porta == true) {
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

    if (!cullingParam.map)
    {
        // non mostro cameraHelper
        scene.remove(cameraHelper);
    }
    // se passo in modalità mappa (camera top)
    else
    {
        // visualizzo la posizione della camera FPS
        scene.add(cameraHelper);
        // attivo il rendering tramite la camera top
        renderer.render(scene, cameraTop);
    }

    // se attivo il frustum culling
    if (cullingParam.useFrustumCulling) {

        // devo assegnare alla mia variabile frustum il volume definito dal frustum della camera fps, ma in coordinate mondo (ossia considerando la camera come un oggetto nella scena, con la sua posizione e orientamento)
        // Per riportare il frustum in coordinate mondo, prendo la matrice di proiezione, e la moltiplico per l'inverso della matrice delle trasformazioni globali applicate alla camera
        frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

        // devo passare tutto l'array dei cubi
        for (var i = 0; i < mura.length; i++) {
            // applico il test di intersezione tra frustum e cubo, sulla base del risultato setto l'oggetto a visibile o invisibile (ossia non lo mando lungo la pipeline)                 
            mura[i].visible = frustum.intersectsObject(mura[i]);
        }
    }
    // se il culling è disabilitato
    else {
        // solo se è stato appena disabilitato (subito dopo il check)
        // NB: se non lo facessi, ad ogni frame rifarei il for su tutti i 2500 cubi per metterli a visibili, anche se non sarebbe necessario
        if (fromCulling) {
            // passo tutto l'array dei cubi e li setto tutti a visibili
            for (var i = 0; i < mura.length; i++) {
                mura[i].visible = true;
            }
            // setto fromCulling a false, in modo che non venga eseguito il for sopra.	
            fromCulling = false;
        }
    }
}