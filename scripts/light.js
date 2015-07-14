

/* global doorLight, Porta_Chiusa, light, Porta1, THREE, wall_material, faro, PortaO, PortaS, PortaN, PortaE, scene, tavoloNE, tavoloNO */
var torch_y = 3.68;
var torch_distance = 0.7;
var light_cone;


/*   -----------------------   
 *  |         3| 1
 *  |  NO      |     NE       POSIZIONE TORCE MURI, torch(NE/SE/NO/SO)+(1/2/3/4)
 *  |          
 *  |         4| 2
 *  |          |        
 *  |        ------ 
 *  |        |
 *  | 1    2 |
 *  ----  ---
 *
 */

var torchNO1, torchNO2, torchNO3, torchNO4;
var torchNE1, torchNE2, torchNE3, torchNE4;
var torchSE1, torchSE2, torchSE3, torchSE4;
var torchSO3, torchSO4;




//piazza una pointLight alla posizione indicata e diverse spotlight nella stessa posizione che puntano ai target
function pointLightGenerator(x, z, target) {

    var pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(x, torch_y, z);
    pointLight.distance = 0;
    pointLight.intensity = 0.2;
    scene.add(pointLight);

    lightSource(pointLight);

    flameGenerator(pointLight);

    spotLightGenerator(pointLight, target);

    return pointLight;

}
function flameGenerator(pointLight) {
  
    // Create a single emitter
    var particleEmitter = new SPE.Emitter({
        type: 'cube',
        position: new THREE.Vector3(pointLight.position.x,pointLight.position.y,pointLight.position.z),
        acceleration: new THREE.Vector3(0, 2, 0),
        velocity: new THREE.Vector3(0, 2, 0),
        particlesPerSecond: 2000,
        sizeStart: 0.5,
        sizeEnd: 0,
        opacityStart: 1,
        opacityEnd: 0,
        colorStart: new THREE.Color('red'),
        colorEnd: new THREE.Color('yellow')
    });


// Add the emitter to the group.
    particleGroup.addEmitter(particleEmitter);


}
//crea una spotlight in origin e che punta a target
//Piazza anche la source sphere
function spotLightGenerator(origin, target) {

    var spotLight = new THREE.SpotLight("#ffffff");

    spotLight.position.set(origin.position.x, origin.position.y, origin.position.z);
    spotLight.castShadow = true;

    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    spotLight.shadowCameraNear = 0.1;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 30;

    scene.add(spotLight);
    spotLight.shadowCameraVisible = true;
    spotLight.target = target;
    scene.add(spotLight);
    lightSource(spotLight);
}

//crea la spotlight per il FARETTO
function spotLightDoor() {

    // LUCI
    var pointColor = "#ffffff";
    doorLight = new THREE.SpotLight(pointColor);
    doorLight.position.set(faro.position.x, faro.position.y + 1.25, faro.position.z + 0.05);
    doorLight.castShadow = true
    doorLight.shadowCameraNear = 0.01
    doorLight.shadowCameraFar = 6
    doorLight.shadowCameraFov = 10
    doorLight.shadowCameraLeft = -2
    doorLight.shadowCameraRight = 2
    doorLight.shadowCameraTop = 1
    doorLight.shadowCameraBottom = -1
    doorLight.shadowBias = 0.0
    doorLight.shadowDarkness = 0.5
    doorLight.shadowMapWidth = 1024
    doorLight.shadowMapHeight = 1024


    doorLight.shadowCameraVisible = true;
    doorLight.distance = 10;

    doorLight.target = Porta_Chiusa;
    scene.add(doorLight);
    ////////////


    //////////////////////////////////////////////////////////////////////////////////
    //		add a volumetric spotligth					//
    //////////////////////////////////////////////////////////////////////////////////

    // add spot light
    var geometry = new THREE.CylinderGeometry(0.16, 1, 4.5, 32 * 2, 20, true);

    var material = new THREEx.VolumetricSpotLightMaterial();
    light_cone = new THREE.Mesh(geometry, material);
    light_cone.position.set(doorLight.position.x - (geometry.parameters.height / 2) - 0.26, doorLight.position.y - 0.08, doorLight.position.z - 0.125);

    light_cone.lookAt(new THREE.Vector3(doorLight.target.position.x, 100, doorLight.target.position.z));
    material.uniforms.lightColor.value.set(0xffffff);
    material.uniforms.spotPosition.value = light_cone.position;
    material.uniforms['anglePower'].value = 0.9;
    material.uniforms['attenuation'].value = 2.5;

    scene.add(light_cone);


    lightSource(doorLight);

}

function computeShadow(object) {
    object.receiveShadow = true;
    object.castShadow = true;
}

function torchLight() {


    // PIAZZAMENTO LUCI TORCE PORTA NORD
    torchNE1 = pointLightGenerator(PortaN.x, PortaN.z - torch_distance, tavoloNE);
    torchNE2 = pointLightGenerator(PortaN.x + 1.82 + 1.59, PortaN.z - torch_distance, tavoloNE);

    torchNO3 = pointLightGenerator(PortaN.x, PortaN.z + torch_distance, tavoloNO);
    torchNO4 = pointLightGenerator(PortaN.x + 1.82 + 1.59, PortaN.z + torch_distance, tavoloNO);

    // PIAZZAMENTO LUCI TORCE PORTA EST
    torchNE3 = pointLightGenerator(PortaE.x - torch_distance, PortaE.z, tavoloNE);
    torchNE4 = pointLightGenerator(PortaE.x - torch_distance, PortaE.z + (1.82 + 1.59), tavoloNE);
    torchSE1 = pointLightGenerator(PortaE.x + torch_distance, PortaE.z, tavoloSE);
    torchSE2 = pointLightGenerator(PortaE.x + torch_distance, PortaE.z + (1.82 + 1.59), tavoloSE);

    // PIAZZAMENTO LUCI TORCE PORTA OVEST
    torchNO1 = pointLightGenerator(PortaO.x - torch_distance, PortaO.z + (1.82 + 1.59), tavoloNO);
    torchNO2 = pointLightGenerator(PortaO.x - torch_distance, PortaO.z, tavoloNO);
    torchSO3 = pointLightGenerator(PortaO.x + torch_distance, PortaO.z, tavoloSO);
    torchSO4 = pointLightGenerator(PortaO.x + torch_distance, PortaO.z + (1.82 + 1.59), tavoloSO);

    // PIAZZAMENTO LUCI TORCE PORTA SUD


    torchSE3 = pointLightGenerator(PortaS.x, PortaS.z - torch_distance, tavoloSE);
    torchSE4 = pointLightGenerator(PortaS.x + 1.82 + 1.59, PortaS.z - torch_distance, tavoloSE);

}

//posiziona sfera che evidenzi la sorgente della luce
function lightSource(source) {
    // LIGHT SOURCE SPHERE //////////////////
    var sphereGeometry = new THREE.SphereGeometry(0.025, 20, 20);
    var darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000});

    var wireframeMaterial = new THREE.MeshBasicMaterial(
            {color: 0x00ff00, wireframe: true, transparent: true});
    var sphere = THREE.SceneUtils.createMultiMaterialObject(
            sphereGeometry, [darkMaterial, wireframeMaterial]);
    sphere.position.x = source.position.x;
    sphere.position.y = source.position.y;
    sphere.position.z = source.position.z;
    scene.add(sphere);
}