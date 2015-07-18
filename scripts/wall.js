var plane;
var portaX=9.88, portaY=2.5, portaZ=8.8;
function set_ambient() {

    // PIANO - MESH
    // dimensioni del piano
    var side_plane = 15;

    var texture, plane_material;

    texture = THREE.ImageUtils.loadTexture("textures/stone.jpg");
    Stexture = THREE.ImageUtils.loadTexture("textures/skirt3.jpg");

    Stexture.wrapS = THREE.RepeatWrapping;
    Stexture.wrapT = THREE.RepeatWrapping;
    Stexture.repeat.set(1, 1);
    SkirtMaterial = new THREE.MeshLambertMaterial({map: Stexture, color: 0xffffff});

// assuming you want the texture to repeat in both directions:
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

// how many times to repeat in each direction; the default is (1,1),
//   which is probably why your example wasn't working
    texture.repeat.set(4, 4);

    plane_material = new THREE.MeshLambertMaterial({map: texture, color: 0xffffff});

    plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(side_plane, side_plane), plane_material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.x = 7.5;
    plane.position.z = 7.5;
    plane.position.y = 1;
    
    plane.receiveShadow = true;

   
    scene.add(plane);

    var SoffittoMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    var soffitto = new THREE.Mesh(new THREE.PlaneBufferGeometry(side_plane, side_plane), SoffittoMaterial);
    //soffitto.material.side = THREE.DoubleSide;
    soffitto.rotation.x = Math.PI / 2;
    soffitto.position.x = 7.5;
    soffitto.position.z = 7.5;
    soffitto.position.y = 6;
    soffitto.receiveShadow = true;

    scene.add(soffitto);


    //Battiscopa
    var b = drawSkirtingBoard();
    var ba = new THREE.Mesh(b, SkirtMaterial);
    ba.position.x = 3.7;
    ba.position.y = 1.75;
    ba.receiveShadow = true;
    scene.add(ba);
    /*BattiscopaN = new THREE.Mesh(new THREE.PlaneGeometry(14.99, 1.5), plane_material);
    BattiscopaN.position.x = 7.5;
    BattiscopaN.position.y = 1.75;
    BattiscopaN.position.z = 0.01;
    
    BattiscopaN.receiveShadow = true;
    scene.add(BattiscopaN);


    BattiscopaE = new THREE.Mesh(new THREE.PlaneGeometry(14.99, 1.5), plane_material);
    BattiscopaE.rotation.y = - Math.PI / 2;
    BattiscopaE.position.x = 14.99;
    BattiscopaE.position.y = 1.75;
    BattiscopaE.position.z = 7.5;
    
    BattiscopaE.receiveShadow = true;
    scene.add(BattiscopaE);


    BattiscopaS = new THREE.Mesh(new THREE.PlaneGeometry(14.99, 1.5), plane_material);
    BattiscopaS.rotation.y = Math.PI;
    BattiscopaS.position.x = 7.5;
    BattiscopaS.position.y = 1.75;
    BattiscopaS.position.z = 14.99;
    
    BattiscopaS.receiveShadow = true;
    scene.add(BattiscopaS);


    BattiscopaO = new THREE.Mesh(new THREE.PlaneGeometry(14.99, 1.5), plane_material);
    BattiscopaO.rotation.y = Math.PI / 2;
    BattiscopaO.position.x = 0.01;
    BattiscopaO.position.y = 1.75;
    BattiscopaO.position.z = 7.5;
    
    BattiscopaO.receiveShadow = true;
    scene.add(BattiscopaO);
*/

    var RumGeometry = drawRum();
    NERum = new THREE.Mesh(RumGeometry, wall_material);
    scene.add(NERum);
    mura.push(NERum);

    SERum = new THREE.Mesh(RumGeometry, wall_material);
    SERum.rotation.y = -Math.PI / 2;
    SERum.position.x = 15;
    scene.add(SERum);
    mura.push(SERum);

    NORum = new THREE.Mesh(RumGeometry, wall_material);
    NORum.rotation.y = Math.PI / 2;
    NORum.position.z = 15;
    scene.add(NORum);
    mura.push(NORum);

    SORum = new THREE.Mesh(drawRum("arr"), wall_material);
    SORum.rotation.y = Math.PI;
    SORum.position.x = 15;
    SORum.position.z = 15;
    scene.add(SORum);
    mura.push(SORum);


    //Porta
    var Porta_ChiusaGeometry = new THREE.BoxGeometry(0.2, 3, 1.8);
    //Porta_Chiusa = new THREE.Mesh(Porta_ChiusaGeometry, new THREE.MeshBasicMaterial({color: 0xff00ff}));
    var doorColor = new THREE.Color().setHSL(0,1.0,0.5);
    Porta_Chiusa = new THREE.Mesh(Porta_ChiusaGeometry, new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/steel.jpg'),color: doorColor}));
    Porta_Chiusa.position.x = portaX;
    Porta_Chiusa.position.y = portaY;
    Porta_Chiusa.position.z = portaZ;
    scene.add(Porta_Chiusa);
    mura.push(Porta_Chiusa);
    

    //Porta Muro Esterno
    Porta_Chiusa_Muro = new THREE.Mesh(Porta_ChiusaGeometry, new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/steel.jpg'),color: doorColor}));
    Porta_Chiusa_Muro.position.x = 14.9;
    Porta_Chiusa_Muro.position.y = portaY;
    Porta_Chiusa_Muro.position.z = 11.8;
    scene.add(Porta_Chiusa_Muro);
    mura.push(Porta_Chiusa_Muro);
    //computeShadow(plane);
    
    
}

/////////////////

function drawRum(brick)
{


    var transformMatrix = new THREE.Matrix4();
    
    var muraEsterne = drawMura(7.5,5);
    transformMatrix.makeTranslation(3.75,3.5,0);
    muraEsterne.applyMatrix(transformMatrix);
    
    var MuroConPortaGeometry1 = drawMuroConPortaED(1.59, 1.82, 1.59, 0.2);
    transformMatrix.makeTranslation(0.8,3.5,7.4);
    MuroConPortaGeometry1.applyMatrix(transformMatrix);
    
    var MuroConPortaGeometry2 = drawMuroConPortaED(1.59, 1.82, 1.59, 0.2);
    transformMatrix.makeRotationY(Math.PI / 2);
    MuroConPortaGeometry2.applyMatrix(transformMatrix);
    transformMatrix.makeTranslation(7.4,3.5,4.2);
    MuroConPortaGeometry2.applyMatrix(transformMatrix);

    var muraInterne;

    if(brick)
    {
        muraInterne = new THREE.BoxGeometry(2.5, 5, 0.01);

        //con una Matrix4 posso applicare le trasformazioni direttamente alla geometria
        var stipiteDestro = new THREE.BoxGeometry(0.35, 5, 0.01);
        transformMatrix.makeTranslation(1.95, 0, 0);
        stipiteDestro.applyMatrix(transformMatrix);
        //1.5 = metà altezza porta, perchè??? boh
        var traversa = new THREE.BoxGeometry(1.6, 2, 0.01);
        transformMatrix.makeTranslation(0.975, 1.5, 0);
        traversa.applyMatrix(transformMatrix);
        muro2 = new THREE.BoxGeometry(0.35, 5, 0.01);
        muro2.merge(traversa);
        muro2.merge(stipiteDestro);
        transformMatrix.makeRotationY(Math.PI / 2);
        muro2.applyMatrix(transformMatrix);
        transformMatrix.makeTranslation(-1.25, 0, 2.13);
        muro2.applyMatrix(transformMatrix);
        
        muraInterne.merge(muro2);

        transformMatrix.makeTranslation(6.25,3.5,5);
        muraInterne.applyMatrix(transformMatrix);
    }
    else
    {
        var muraInterne = drawMura(2.5,5);
        transformMatrix.makeTranslation(6.25,3.5,5);
        muraInterne.applyMatrix(transformMatrix);
    }

    var rum = new THREE.Geometry();
    rum.merge(muraEsterne);
    rum.merge(MuroConPortaGeometry1);
    rum.merge(MuroConPortaGeometry2);
    rum.merge(muraInterne);

    return rum;
}

function drawMura(x1, y1) 
{
    var transformMatrix = new THREE.Matrix4();
    var muro = new THREE.BoxGeometry(x1, y1, 0.01);
    var muro2 = new THREE.BoxGeometry(0.01, y1, x1);
    transformMatrix.makeTranslation(-x1 / 2, 0, x1 / 2);
    muro2.applyMatrix(transformMatrix);

    muro.merge(muro2);

    return muro;
}

function drawMuroConPortaED(sS, tr, sD, sp)
{
    var transformMatrix = new THREE.Matrix4();
    //con una Matrix4 posso applicare le trasformazioni direttamente alla geometria
    transformMatrix.makeTranslation(sS + tr - 0.01, 0, 0);
    var stipiteDestro = new THREE.BoxGeometry(sD, 5, sp);
    stipiteDestro.applyMatrix(transformMatrix);
    //1.5 = metà altezza porta, perchè??? boh
    transformMatrix.makeTranslation(sS + 0.11, 1.5, 0);
    var traversa = new THREE.BoxGeometry(tr, 2, sp);
    traversa.applyMatrix(transformMatrix);
    var muro = new THREE.BoxGeometry(sS, 5, sp);
    muro.merge(traversa);
    muro.merge(stipiteDestro);
    return muro;
}

function drawSkirtingBoard()
{
    var transformMatrix = new THREE.Matrix4();

    function draw()
    {
        var skirt = new THREE.PlaneGeometry(7.3, 1.5);
        transformMatrix.makeTranslation(-0.04, 0, 0.01);
        skirt.applyMatrix(transformMatrix);

        var plane2 = new THREE.PlaneGeometry(7.3, 1.5);
        transformMatrix.makeRotationY(Math.PI / 2);
        //transformMatrix.makeRotationY(Math.PI);
        plane2.applyMatrix(transformMatrix);
        transformMatrix.makeTranslation(/*-3.69*/0, 0, 3.65);
        plane2.applyMatrix(transformMatrix);

        var plane3 = new THREE.PlaneGeometry(1.59, 1.5);
        transformMatrix.makeRotationY(-Math.PI / 2);
        plane3.applyMatrix(transformMatrix);
        transformMatrix.makeTranslation(3.595, 0, 0.80);
        plane3.applyMatrix(transformMatrix);
/*
        var plane4 = new THREE.PlaneGeometry(0.40, 1.5);
        transformMatrix.makeTranslation(3.80, 0, 1.6);
        plane4.applyMatrix(transformMatrix);
*/
        var plane5 = new THREE.PlaneGeometry(1.59, 1.5);
        transformMatrix.makeRotationY(Math.PI / 2);
        plane5.applyMatrix(transformMatrix);
        transformMatrix.makeTranslation(4.01, 0, 0.80);
        plane5.applyMatrix(transformMatrix);

        skirt.merge(plane2);
        skirt.merge(plane3);
        //skirt.merge(plane4);
        skirt.merge(plane5);

        return skirt;
    }
    
    s1 = draw();
    
    s2 = draw();
    transformMatrix.makeRotationY(- Math.PI / 2);
    s2.applyMatrix(transformMatrix);
    transformMatrix.makeTranslation(11.3, 0, 3.7);
    s2.applyMatrix(transformMatrix);

    s3 = draw();
    transformMatrix.makeRotationY(- Math.PI );
    s3.applyMatrix(transformMatrix);
    transformMatrix.makeTranslation(7.6, 0, 15);
    s3.applyMatrix(transformMatrix);

    s4 = draw();
    transformMatrix.makeRotationY(Math.PI / 2);
    s4.applyMatrix(transformMatrix);
    transformMatrix.makeTranslation(-3.7, 0, 11.3);
    s4.applyMatrix(transformMatrix);


    s1.merge(s2);
    s1.merge(s3);
    s1.merge(s4);

    return s1;

}

