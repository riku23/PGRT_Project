// MARBLE
// CREO L'INTERFACCIA GRAFICA
var shaders_CT, uniforms_CT;
var uniforms;
var guiParam = {
    chooseTexture: 'tex1',
    frequency: 2.0,
    power: 0.5
};
function initGui() {


    // Creo e imposto l'interfaccia grafica
    var gui = new dat.GUI();

    gui.add(guiParam, 'frequency', 1.0, 50.0).step(1.0).onChange(function () {
        // al variare dello slider, aggiorno il valore dell'uniform
        uniforms.frequency.value = guiParam.frequency;
    });
    gui.add(guiParam, 'power', 0.5, 3.0).onChange(function () {
        // al variare dello slider, aggiorno il valore dell'uniform
        uniforms.power.value = guiParam.power;
    });

    customContainer = document.createElement('gui');
    customContainer.style.cssText = "position:absolute;top:0px;right:0px;z-index:110;";
    customContainer.appendChild(gui.domElement);
    document.body.appendChild(customContainer);
}

function marble() {


    var material
    uniforms = {
        // provare a cambiare pattern usando texture5 o texture6
        tex: {type: "t", value: THREE.ImageUtils.loadTexture("textures/gradientmarble.png")},
        frequency: {type: "f", value: 40},
        power: {type: "f", value: 1.0}
    };

    shaders = {
        fragmentShader: 'shaders/23_marble.fs',
        vertexShader: 'shaders/16_procedural_base.vs',
        side: THREE.DoubleSide
    };

// unisco le variabili precedenti in una struttura sola
    var parameters;

    var count = 0;
// usage:
    loadShaders(shaders,
            function (progress) {
                console.log(progress, 'loaded');
            },
            function () {
                console.log('done loading shaders.');
                count = count + 1;
                parameters = {
                    fragmentShader: shaders.fragmentShader,
                    vertexShader: shaders.vertexShader,
                    uniforms: uniforms
                };

                // creo un materiale di tipo RawShader
                // la classe RawShaderMaterial (introdotta nella release r67)
                // permette di utilizzare codice GLSL il più "standard" possibile (e quindi maggiormente portabile tra diversi engine/ambienti): questo significa pero' dover dichiarare "manualmente" all'inizio degli shader tutti gli uniform utilizzati (per es quelli delle matrici di vista e proiezione). 
                // Three.js fornisce anche una classe ShaderMaterial, dove questo insieme di variabili possono essere utilizzate direttamente, senza doverle dichiarare, come se fossero variabili predefinite. In questo caso, in pratica, in fase di compilazione e linking dello shader, la libreria aggiunge automaticamente una lunga lista di dichiarazioni di costanti e variabili uniform all'inizio del codice dello shader. Questo approccio permette di semplificare l'implementazione da parte dello sviluppatore, ma rende meno portabile il codice degli shader.
                this.wall_material = new THREE.RawShaderMaterial(parameters);
                createModels();
            }
    );
}

function cook_torrance() {
    // COOK-TORRANCE

    var shaders_CT, uniforms_CT;
    // Peso per la componente diffusiva
    var Kd = 0.8;
    // Coefficiente Fresnel
    var F0 = 1.5; // provare a mettere = 3
    // Coefficiente rugosità
    var roughnessValue = 0.1;

    uniforms_CT = {
        Kd: {type: "f", value: Kd},
        F0: {type: "f", value: F0},
        m: {type: "f", value: roughnessValue},
        tex: {type: "t", value: THREE.ImageUtils.loadTexture("textures/gradientmarble.png")},
        frequency: {type: "f", value: 10},
        power: {type: "f", value: 2},
        pointLightPosition2: {type: "v3", value: doorLight.position},
        pointLightPosition1: {type: "v3", value: torchNO1.position},

        
    };

    shaders_CT = {
        fragmentShader: 'shaders/24_cooktorrance_marble.fs',
        vertexShader: 'shaders/14_cooktorrance_tex.vs',
        side: THREE.DoubleSide,
    };

    var parameters_CT;

    // creo un nodo padre
    bunnyMesh_CT = new THREE.Object3D();
    scene.add(bunnyMesh_CT);


    // Carico gli shader e creo il modello con il modello di Cook-Torrance
    loadShaders(shaders_CT,
            function (progress) {
                console.log(progress, 'Cook-Torrance loaded');
            },
            function () {
                console.log('done loading shaders Cook-Torrance.');
                parameters_CT = {
                    fragmentShader: shaders_CT.fragmentShader,
                    vertexShader: shaders_CT.vertexShader,
                    uniforms: uniforms_CT
                };

                var material = new THREE.RawShaderMaterial(parameters_CT);
                // creo la mesh
                loadMaterial(material);
                
            }
    );
}

function loadMaterial(material)
{
    MuraEsterne.material = material;
    MuraInterne.material = material;
    PortaN.material = material;
    PortaS.material = material;
    PortaO.material = material;
    PortaE.material = material;
}