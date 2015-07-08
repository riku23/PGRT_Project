

/* global doorLight, Porta_Chiusa, light, Porta1, THREE, wall_material, faro */
var torch_y = 3.5;
var torch_distance = 0.6;
function pointLightGenerator(x,z) {
    var light = new THREE.PointLight(0xfff0ff, 1, 100);
    light.position.set(x, torch_y, z);
    light.distance = 0;
    light.intensity = 0.5;
    scene.add(light);

    // SFERA ORIGINE
    var sphereGeometry = new THREE.SphereGeometry(0.1, 20, 20);
    var darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000});

    var wireframeMaterial = new THREE.MeshBasicMaterial(
            {color: 0xffff00, wireframe: true, transparent: true});
    var sphere = THREE.SceneUtils.createMultiMaterialObject(
            sphereGeometry, [darkMaterial, wireframeMaterial]);
    sphere.position.x = light.position.x;
    sphere.position.y = light.position.y;
    sphere.position.z = light.position.z;
    scene.add(sphere);
}

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
function spotLightPlacing() {

    // LUCI
    var pointColor = "#ffffff";
    doorLight = new THREE.SpotLight(pointColor);
    doorLight.position.set(faro.position.x,faro.position.y+1.25,faro.position.z+0.05);
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
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(doorLight.position.x - (geometry.parameters.height / 2)-0.26, doorLight.position.y-0.08, doorLight.position.z-0.125);
    mesh.lookAt(new THREE.Vector3(doorLight.target.position.x, 100, doorLight.target.position.z));
    material.uniforms.lightColor.value.set('white');
    material.uniforms.spotPosition.value = mesh.position;
    material.uniforms['anglePower'].value = 0;
    material.uniforms['attenuation'].value = 10;
    //0.9 2.5 
    //material.uniforms.lightColor.value.set(options.lightColor);
    //mesh.position.set(11, 4, 8.64);
    scene.add(mesh);


    // LIGHT SOURCE SPHERE //////////////////
    var sphereGeometry = new THREE.SphereGeometry(0.2, 20, 20);
    var darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000});

    var wireframeMaterial = new THREE.MeshBasicMaterial(
            {color: 0xffff00, wireframe: true, transparent: true});
    var sphere = THREE.SceneUtils.createMultiMaterialObject(
            sphereGeometry, [darkMaterial, wireframeMaterial]);
    sphere.position.x = doorLight.position.x;
    sphere.position.y = doorLight.position.y;
    sphere.position.z = doorLight.position.z;
    scene.add(sphere);

    // LIGHT CONE V1 //////////////////////////
    /*
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
     
     
     scene.add(light_cone);
     */


    // SFERA DI PROVA//////////
    var sphereGeometryT = new THREE.SphereGeometry(0.25, 20, 20);
    sphereGeometryT.computeTangents(); 
    var sphereT = new THREE.Mesh(sphereGeometryT, this.wall_material);
    sphereT.position.x = doorLight.position.x - 4;
    sphereT.position.y = doorLight.position.y - 1;
    sphereT.position.z = doorLight.position.z;
    
    sphereT.castShadow = true;
    sphereT.receiveShadow = true;
    scene.add(sphereT);
    ////////////////////
}