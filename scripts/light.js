

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