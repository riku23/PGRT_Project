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


function cook_torrance(room, lights, num_l) {
    // COOK-TORRANCE

    var shaders_CT, uniforms_CT;
    // Peso per la componente diffusiva
    var Kd = 0.8;
    // Coefficiente Fresnel
    var F0 = 1.5; // provare a mettere = 3
    // Coefficiente rugosità
    var roughnessValue = 0.1;

    if (lights.length==2){
    //alert("2luci");
    uniforms_CT = {
        Kd: {type: "f", value: Kd},
        F0: {type: "f", value: F0},
        m: {type: "f", value: roughnessValue},
        tex: {type: "t", value: THREE.ImageUtils.loadTexture("textures/gradientmarble.png")},
        frequency: {type: "f", value: 10},
        power: {type: "f", value: 2},
        num_lights: {type: "i", value: num_l},
        pointLightPosition1: {type: "v3", value: lights[0].position},
        pointLightPosition2: {type: "v3", value: lights[1].position},

    };
    } else {
            alert("4luci");

        uniforms_CT = {
        Kd: {type: "f", value: Kd},
        F0: {type: "f", value: F0},
        m: {type: "f", value: roughnessValue},
        tex: {type: "t", value: THREE.ImageUtils.loadTexture("textures/gradientmarble.png")},
        frequency: {type: "f", value: 10},
        power: {type: "f", value: 2},
        num_lights: {type: "i", value: num_l},
        pointLightPosition1: {type: "v3", value: lights[0].position},
        pointLightPosition2: {type: "v3", value: lights[1].position},
        pointLightPosition3: {type: "v3", value: lights[2].position},
        pointLightPosition4: {type: "v3", value: lights[3].position},
    };
    }

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
                loadMaterial(room, material);

            }
    );
}

function loadMaterial(room, material)
{
    room.material = material;

}