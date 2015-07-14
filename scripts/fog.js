
function fogGenerator() {
    var texture = THREE.ImageUtils.loadTexture('images/cloudSml.png');
// texture.magFilter = THREE.LinearMipMapLinearFilter;
// texture.minFilter = THREE.LinearMipMapLinearFilter;

    this.particleGroupFog = new SPE.Group({
        texture: texture,
        maxAge: 5
    });

    emitter = new SPE.Emitter({
        position: new THREE.Vector3(2, 1, 12),
        positionSpread: new THREE.Vector3(1, 1, 1),
        colorStart: new THREE.Color('black'),
        colorStartSpread: new THREE.Vector3(1, 1, 1),
        colorEnd: new THREE.Color('black'),
        sizeStart: 500,
        sizeSpread: 10,
        opacityStart: 0,
        opacityMiddle: 1,
        opacityEnd: 0,
        particleCount: 50,
    });

    particleGroupFog.addEmitter(emitter);
    scene.add(particleGroupFog.mesh);
}

