
/* global torchNO1, torchNO2, SORum, torchSO1, torchSO2, NORum, SERum, NERum, torchNO3, torchNO4 */

// controlla il supporto a WebGL (se la scheda grafica non lo supporta viene mostato un messaggio d'errore)
//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

// variabili globali per la scena, il renderer ecc
var scene, renderer;


var raycaster = new THREE.Raycaster();
// variabili per la camera
var camera, controls,
        MOVESPEED = 5,
        LOOKSPEED = 0.05;
var spawnX = 14, spawnY = 3, spawnZ = 12;
var INIBITELO;
var oggettoFaro;
var oldX, oldY, oldZ;
var filtri;
var livello;
var mouse = {x: 0, y: 0}
var oggettiPrendibili=[];
var inventario;
var inventarioPos;
var oggetti;
var mura = [];
var tentativi;
var tween;


// variabile per la gestione del frustum culling
var frustum;



//MESH
var light_cone;
var plane;
var MuraEsterne, MuraInterne;
var PortaN, PortaS, PortaO, PortaE;
var faro;
var filtroRisultato, filtroRosso;
var tavoloSE, tavoloNO, tavoloNE, tavoloSO;
var torciaNE1,torciaNE2,torciaNE3,torciaNE4;
var torciaNO1,torciaNO2,torciaNO3,torciaNO4;
var torciaNO1,torciaSE2,torciaSE3,torciaSE4;
var torciaSO3,torciaSO4;
var mesh;
var Porta_Chiusa;
var light_cone;
var material;
//MATERIALS
var wall_material;

var PortaN = new THREE.Vector3(0.8,3.5,7.5);
var PortaS = new THREE.Vector3(10.8,3.5,7.5);
var PortaE = new THREE.Vector3(7.5,3.5,0.8);
var PortaO = new THREE.Vector3(7.5,3.5,10.8);

var sphere_test;


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

function setDefaultVariables(livello,filtri) {
    //SETUP VARIABILI
    this.livello = livello;
    tentativi = 1;
    this.filtri = filtri;
    INIBITELO = false;
    inventario = [];
    oggetti = 0;
    inventarioPos= 0;
}







// INIZIALIZZAZIONE
//Funzioni di inizializzazione della scena
function init()
{
    
    
    // SCENE
    // creo una istanza della classe Scene (radice del grafo della scena che avrà come nodi i modelli, luce, ecc della scena)
    scene = new THREE.Scene();
    ////////////
    $('body').append('<button id="combine" type="button" style="width: 100px; height: 20px;"> COMBINE </button>');
    document.getElementById("combine").onclick = function() {combine()};

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
    setDefaultVariables(1,1);

    //HUD
    setupHUD(livello);
    document.getElementById("inventory1").style.border= "2px solid yellow";

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
    setFiltri(livello);

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

    //TAVOLO Sud-Est
    tavoloSE = new THREE.Mesh();
    tavoloSE.position.set(14, 1, 1);


    
    loader.load("models/tavolo2.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        tavoloSE.geometry = geometry;
        tavoloSE.material = materials;


        // ruoto il modello di 180° sull'asse Y
        tavoloSE.rotation.x = -Math.PI/2;
        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        tavoloSE.scale.set(0.035, 0.035, 0.035);
        mura.push(tavoloSE);
        scene.add(tavoloSE);

    });


    //TAVOLO Nord-Ovest
    tavoloNO = new THREE.Mesh();
    tavoloNO.position.set(1, 1, 14);
    loader.load("models/tavolo2.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        tavoloNO.geometry = geometry;
        tavoloNO.material = materials;

        // ruoto il modello di 180° sull'asse Y
        tavoloNO.rotation.x = -Math.PI/2;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        tavoloNO.scale.set(0.035, 0.04, 0.035);
        mura.push(tavoloNO);
        scene.add(tavoloNO);

    });
    
   

    //TAVOLO Nord-Est
    tavoloNE = new THREE.Mesh();
    tavoloNE.position.set(1, 1, 1);
    loader.load("models/tavolo2.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        tavoloNE.geometry = geometry;
        tavoloNE.material = materials;

        // ruoto il modello di 180° sull'asse Y
        tavoloNE.rotation.x = -Math.PI/2;
        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        tavoloNE.scale.set(0.035, 0.04, 0.035);
        mura.push(tavoloNE);
        scene.add(tavoloNE);

    });

    //TAVOLO Sud-Ovest
    tavoloSO = new THREE.Mesh();
    tavoloSO.position.set(14, 1, 14);
    loader.load("models/tavolo2.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        tavoloSO.geometry = geometry;
        tavoloSO.material = materials;

        // ruoto il modello di 180° sull'asse Y
        tavoloSO.rotation.x = -Math.PI/2;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        tavoloSO.scale.set(0.035, 0.04, 0.035);
        mura.push(tavoloSO);
        scene.add(tavoloSO);
    });

    //torcia NO1
    torciaNO1 = new THREE.Mesh();
    torciaNO1.position.set(7, 3, PortaO.z);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaNO1.geometry = geometry;
        torciaNO1.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaNO1.rotation.y = -Math.PI/2;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaNO1.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNO1);
        scene.add(torciaNO1);
    });

       //torcia NO2
    torciaNO2 = new THREE.Mesh();
    torciaNO2.position.set(7, 3, PortaO.z+1.82+1.59);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaNO2.geometry = geometry;
        torciaNO2.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaNO2.rotation.y = -Math.PI/2;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaNO2.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNO2);
        scene.add(torciaNO2);
    });

   //torcia NO3
    torciaNO3 = new THREE.Mesh();
    torciaNO3.position.set(PortaN.x+1.82+1.59, 3, 8 );
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaNO3.geometry = geometry;
        torciaNO3.material = materials;

    

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaNO3.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNO3);
        scene.add(torciaNO3);
    });
   //torcia NO4
    torciaNO4 = new THREE.Mesh();
    torciaNO4.position.set(PortaN.x, 3,8 );
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaNO4.geometry = geometry;
        torciaNO4.material = materials;

       
        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaNO4.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNO4);
        scene.add(torciaNO4);
    });


        //torcia NE1
    torciaNE1 = new THREE.Mesh();
    torciaNE1.position.set(PortaN.x, 3, 7);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaNE1.geometry = geometry;
        torciaNE1.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaNE1.rotation.y = Math.PI;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaNE1.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNE1);
        scene.add(torciaNE1);
    });

       //torcia NE2
    torciaNE2 = new THREE.Mesh();
    torciaNE2.position.set((PortaN.x+1.82+1.59), 3, 7);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaNE2.geometry = geometry;
        torciaNE2.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaNE2.rotation.y = Math.PI;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaNE2.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNE2);
        scene.add(torciaNE2);
    });

   //torcia NE3
    torciaNE3 = new THREE.Mesh();
    torciaNE3.position.set(7, 3, PortaE.z);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaNE3.geometry = geometry;
        torciaNE3.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaNE3.rotation.y = -Math.PI/2;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaNE3.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNE3);
        scene.add(torciaNE3);
    });

   //torcia NE4
    torciaNE4 = new THREE.Mesh();
    torciaNE4.position.set(7, 3, (PortaE.z+1.82+1.59));
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaNE4.geometry = geometry;
        torciaNE4.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaNE4.rotation.y = -Math.PI/2;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaNE4.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNE4);
        scene.add(torciaNE4);
    });

       //torcia SE1
    torciaSE1 = new THREE.Mesh();
    torciaSE1.position.set(8, 3, PortaE.z);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaSE1.geometry = geometry;
        torciaSE1.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaSE1.rotation.y = Math.PI/2;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaSE1.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSE1);
        scene.add(torciaSE1);
    });

       //torcia SE2
    torciaSE2 = new THREE.Mesh();
    torciaSE2.position.set(8, 3, PortaE.z+1.82+1.59);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaSE2.geometry = geometry;
        torciaSE2.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaSE2.rotation.y = Math.PI/2;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaSE2.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSE2);
        scene.add(torciaSE2);
    });

   //torcia SE3
    torciaSE3 = new THREE.Mesh();
    torciaSE3.position.set(PortaS.x, 3, 7);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaSE3.geometry = geometry;
        torciaSE3.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaSE3.rotation.y = Math.PI;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaSE3.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSE3);
        scene.add(torciaSE3);
    });

   //torcia SE4
    torciaSE4 = new THREE.Mesh();
    torciaSE4.position.set(PortaS.x+1.82+1.59, 3, 7);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaSE4.geometry = geometry;
        torciaSE4.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaSE4.rotation.y = Math.PI;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaSE4.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSE4);
        scene.add(torciaSE4);
    });


   //torcia SO3
    torciaSO3 = new THREE.Mesh();
    torciaSO3.position.set(8, 3, PortaO.z+1.82+1.59);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaSO3.geometry = geometry;
        torciaSO3.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaSO3.rotation.y = Math.PI/2;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaSO3.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSO3);
        scene.add(torciaSO3);
    });
   //torcia SO4
    torciaSO4 = new THREE.Mesh();
    torciaSO4.position.set(8, 3, PortaO.z);
    loader.load("models/torcia.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});
        torciaSO4.geometry = geometry;
        torciaSO4.material = materials;

        // ruoto il modello di 180° sull'asse Y
        torciaSO4.rotation.y = Math.PI/2;

        // lo posiziono sopra il piano
        
        // lo scalo per metterlo in scala con la scena
        torciaSO4.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSO4);
        scene.add(torciaSO4);
    });


    
    computeShadow(tavoloSO);
    computeShadow(tavoloSE);
    computeShadow(tavoloNO);
    computeShadow(tavoloNE);
    /*computeShadow(torciaNO1);
    computeShadow(torciaNO2);
    computeShadow(torciaNO3);
    computeShadow(torciaNO4);
    computeShadow(torciaNE1);
    computeShadow(torciaNE2);
    computeShadow(torciaNE3);
    computeShadow(torciaNE4);
    computeShadow(torciaSE1);
    computeShadow(torciaSE2);
    computeShadow(torciaSE3);
    computeShadow(torciaSE4);
    computeShadow(torciaSO3);
    computeShadow(torciaSO4);
    computeShadow(SORum);
    computeShadow(SERum);
    computeShadow(NORum);
    computeShadow(NERum);*/
    computeShadow(faro);





    //Ho bisogno della posizione del faro per posizionare la spotlight, quindi richiamo la funzione dopo
    //piazzo la luce dal faretto
    spotLightDoor();
    torchLight();
    //carico shader per mura
    
    cook_torrance(SORum,[torchSO3,torchSO4]);
    cook_torrance(SERum,[torchSE1,torchSE2,torchSE3,torchSE4]);
    cook_torrance(NERum,[torchNE1,torchNE2,torchNE3,torchNE4]);
    cook_torrance(NORum,[torchNO1,torchNO2,torchNO3,torchNO4]);


}


    // FUNZIONE DI PICKING
    $(document).click(function (e) {
        e.preventDefault;

        raycaster.setFromCamera(mouse, camera);
        intersections = raycaster.intersectObjects(oggettiPrendibili);

        if (e.which == 1 && INIBITELO == false) {

             if (intersections.length > 0) {
                //inventario libero
                intersected = intersections[ 0 ].object;
                var distance = intersections[0].distance;

                if (intersected && intersected != faro && distance < 3) {
                    //prendo l'oggetto
                    if(inventario[inventarioPos]==null){
                        if(intersected==oggettoFaro){
                            light_cone.material.uniforms.lightColor.value.set(0xffffff);
                            oggettoFaro=null;
                        }
                        inventario[inventarioPos] = intersected;
                        intersected.position.x = 100;
                        intersected.position.y = 100;
                        intersected.position.z = 100;
                        var realIndex = inventarioPos+1;
                        document.getElementById("inventory"+realIndex.toString()).style.backgroundImage = "url(textures/inventario/" + intersected.name + ".jpg)"
                        console.log("preso oggetto inventario libero");
                    }else{
                        if(intersected==oggettoFaro){
                            light_cone.material.uniforms.lightColor.value.set(inventario[inventarioPos].material.color);
                            oggettoFaro=inventario[inventarioPos];
                            checkFaro();
                        }
                        inventario[inventarioPos].position.x = intersected.position.x;
                        inventario[inventarioPos].position.y = intersected.position.y;
                        inventario[inventarioPos].position.z = intersected.position.z;
                        intersected.position.x = 100;
                        intersected.position.y = 100;
                        intersected.position.z = 100;
                        inventario[inventarioPos] = intersected;
                        var realIndex = inventarioPos+1;
                        document.getElementById("inventory"+realIndex.toString()).style.backgroundImage = "url(textures/inventario/" + intersected.name + ".jpg)"
                        console.log("scambio oggetti");

                        }
                    }else{
                        if (inventario[inventarioPos] != null &&intersected && intersected == faro && distance < 3 && oggettoFaro == null) {
                            //se interseco il faro posiziono l'oggetto in inventario su di esso
                            inventario[inventarioPos].position.x = faro.position.x-0.3;
                            inventario[inventarioPos].position.y = faro.position.y + 1.24;
                            inventario[inventarioPos].position.z = faro.position.z+0.03;
                            oggettoFaro = inventario[inventarioPos];
                            console.log(oggettoFaro.material.color.getHex() +" - " + Porta_Chiusa.material.color.getHex());
                            inventario[inventarioPos]=null;
                            var realIndex = inventarioPos+1;
                            light_cone.material.uniforms.lightColor.value.set(oggettoFaro.material.color);
                            document.getElementById("inventory"+realIndex.toString()).style.backgroundImage = "";
                            checkFaro();
                            console.log("posizionato oggetto su faro");
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

function addColors(color1, color2, colorResult){
        a0 = color1.getHSL().h*360;
        a1 = color2.getHSL().h*360;
        r0 = (a0+a1)/2.; 
        r1 = ((a0+a1+360)/2.)%360; 
        console.log(r0,r1);
        if(Math.min(Math.abs(a1-r0), Math.abs(a0-r0)) < Math.min(Math.abs(a0-r1), Math.abs(a1-r1))){
        colorResult.setHSL(r0/360,1.0,0.5);
        }
        else{
        
        colorResult.setHSL(r1/360,1.0,0.5);
        }
    }

function checkFaro() {
    if (oggettoFaro.material.color.getHex() == Porta_Chiusa.material.color.getHex()) {
        console.log("RISOLTO!")
        setDoorAnimation();
        INIBITELO = true;
    } else {
        console.log("ERRORE!");
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

function nuovoLivello(){
    livello=livello+1;
    filtri=filtri+1;
    if(livello>=3){
        $(renderer.domElement).fadeOut();
        $('#hud,#inventory1,#inventory2,#inventory3,#inventory4,#oggetti,#combine').fadeOut();
        $('#intro').fadeIn();
        $('#intro').html('Sei Bello, hai vinto!');
    }
    camera.rotation.y = Math.PI / 2;
    camera.position.x = spawnX;
    camera.position.y = spawnY;
    camera.position.z = spawnZ;
    Porta_Chiusa.position.x = portaX;
    Porta_Chiusa.position.y = portaY;
    Porta_Chiusa.position.z = portaZ;
    var doorColor = new THREE.Color().setHSL(0.385,1.0,0.5);
    Porta_Chiusa.material.color = doorColor;
    light_cone.material.uniforms.lightColor.value.set(0xffffff);
    oggettoFaro=null;
    console.log(livello);
    setDefaultVariables(livello,filtri); //Dovrei fare livello+1 e filtri+1
    
    setupHUD(livello);
    setFiltri(livello);
    console.log(livello);


}

function setupHUD(livello){

    // Display HUD
    switch(livello){
    
    case 1:
   
    $('body').append('<div id="inventory1" style="background-image:; width: 100px; height: 100px; background-size: 100%;"></div>');
    $('body').append('<div id="hud"><p>Oggetti: <span id="oggetti">0</span></p></div>'); break;
    
    case 2:

    $('body').append('<div id="inventory1" style="background-image:; width: 100px; height: 100px; background-size: 100%;"></div>');
    $('body').append('<div id="inventory2" style="background-image:; width: 100px; height: 100px; background-size: 100%;"></div>');
    $('body').append('<div id="hud"><p>Oggetti: <span id="oggetti">0</span></p></div>'); break;

    }
}
function svuotaInventario(){
     for(i=0;i<filtri;i++){
            var realIndex = i+1;
            document.getElementById("inventory"+realIndex.toString()).style.backgroundImage = "";
            inventario[i]=null;
        }

}

function combine() {
    if(livello==1){
        alert("Al livello 1 non si combina");
    }else{
        for(i=0;i<filtri;i++){
            if(inventario[i]==null){
                alert("Riempi l'inventario prima");
                return;
            }

        }
        addColors(inventario[0].material.color,inventario[1].material.color,filtroRisultato.material.color);
        var nome =inventario[0].name + inventario[1].name;
        svuotaInventario();
        console.log(nome);
        document.getElementById("inventory1").style.backgroundImage = "url(textures/inventario/" + nome + ".jpg)";
        inventario[0] = filtroRisultato;
    }
}

function createFiltri(){
                //filtro Risultato
                var filterColor = new THREE.Color().setHSL(0,1.0,0.5);
                filtroRisultato = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/filtro.jpg'), color: filterColor}));
                filtroRisultato.position.set(100,100, 100);
                filtroRisultato.name = "risultato";
                oggettiPrendibili.push(filtroRisultato);
                mura.push(filtroRisultato);
                scene.add(filtroRisultato);

                //  filtro Rosso
                var filterColor = new THREE.Color().setHSL(0,1.0,0.5);
                filtroRosso = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/filtro.jpg'), color: filterColor}));
                filtroRosso.position.set(100,100, 100);
                filtroRosso.name = "rosso";
                filtroRosso.color = filterColor;
                oggettiPrendibili.push(filtroRosso);
                mura.push(filtroRosso);
                scene.add(filtroRosso);


                //  filtro Blu
                var filterColor = new THREE.Color().setHSL(0.6,1.0,0.5);
                filtroBlu = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/filtro.jpg'), color: filterColor}));
                filtroBlu.position.set(100,100,100);
                filtroBlu.name = "blu";
                oggettiPrendibili.push(filtroBlu);
                mura.push(filtroBlu);
                scene.add(filtroBlu); 

                //  filtro Giallo
                var filterColor = new THREE.Color().setHSL(0.17,1.0,0.5);
                filtroGiallo = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/filtro.jpg'), color: filterColor}));
                filtroGiallo.position.set(100,100,100);
                filtroGiallo.name = "giallo";
                oggettiPrendibili.push(filtroGiallo);
                mura.push(filtroGiallo);
                scene.add(filtroGiallo); 
}

function setFiltri(livello){
    switch( livello ) {
        case 1:
    
                filtroRosso.position.set(1, 2.4, 1);
                
                filtroBlu.position.set(1, 2.4, 14);

                filtroGiallo.position.set(14, 2.4, 14);
                
                break;

        case 2:             
              
                filtroRosso.position.set(1, 2.4, 1);
              
                filtroBlu.position.set(1, 2.4, 14);

                filtroGiallo.position.set(14, 2.4, 14);
                break;

    }
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

    // Death
    if (tentativi <= 0) {

        $(renderer.domElement).fadeOut();
        $('#hud,#inventory1,#inventory2,#inventory3,#inventory4,#oggetti,#combine').fadeOut();
        $('#intro').fadeIn();
        $('#intro').html('Darkness consumes you');
    
    }
    if(INIBITELO && camera.position.x<portaX && camera.position.z>portaZ){
       nuovoLivello();
    }

    // chiamo la funzione di rendering
    render();
    TWEEN.update();
}

// funzione di rendering
function render()
{
    var delta = clock.getDelta(), speed = delta * MOVESPEED;
    controls.update(delta); // Move camera
    renderer.render(scene, camera);


    

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