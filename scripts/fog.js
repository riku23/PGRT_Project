
function fogGenerator() {
    var texture = THREE.ImageUtils.loadTexture('images/cloudSml1.png');
// texture.magFilter = THREE.LinearMipMapLinearFilter;
// texture.minFilter = THREE.LinearMipMapLinearFilter;

    var planeBlack = new THREE.Mesh(new THREE.PlaneBufferGeometry(4, 4),new THREE.MeshBasicMaterial({color: 0x0d0d0d}));
    planeBlack.position.set(Porta_Chiusa.position.x-0.6, Porta_Chiusa.position.y, Porta_Chiusa.position.z-0.9);
    planeBlack.rotation.y = Math.PI/2;
    planeBlack.rotation.x = Math.PI/2;
    scene.add(planeBlack);
    emitter = new SPE.Emitter({
        position: new THREE.Vector3(Porta_Chiusa.position.x-0.4, Porta_Chiusa.position.y, Porta_Chiusa.position.z+0.7),
        positionSpread: new THREE.Vector3(0, 3, 0),
        colorStart: new THREE.Color('black'),
        acceleration: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, -0.3),
        colorEnd: new THREE.Color().setHSL(0,0,0.05),
        sizeStart: 4,
        sizeSpread: 2,
        opacityStart: 1,
        opacityMiddle: 1,
        opacityEnd: 1,
        particleCount: 1000,
        
    });

    particleGroupFog.addEmitter(emitter);
    
}

