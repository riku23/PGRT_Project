function set_ambient() {
    // PIANO - MESH
    // dimensioni del piano
    var side_plane = 100
    var height_plane = 2;

    // PIANO - MESH
    // dimensioni del piano
    var side_plane = 15;
    var height_plane = 2;
    planeGeometry = new THREE.BoxGeometry(side_plane, height_plane, side_plane);
    planeMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('textures/wall.png'), color: 0xffffff});

    // parametri di applicazione della texture (al momento non approfondire)
    planeMaterial.map.repeat.x = 20;
    planeMaterial.map.repeat.y = 20;
    planeMaterial.map.wrapS = THREE.RepeatWrapping;
    planeMaterial.map.wrapT = THREE.RepeatWrapping;

    // creo la mesh
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(7.5, 0, 7.5);
    //plane.position.set(0,5,0);
    //plane.rotation.z = -Math.PI;
    // la aggiungo alla scena
    scene.add(plane);
    //Prova Mausoleo
    // Mura esterne
    var MuraEsterneGeometry = drawMura(15, 5, 15, false);
    var MuraEsterneMaterial = new THREE.MeshBasicMaterial({color: 0xF6831E});
    MuraEsterne = new THREE.Mesh(MuraEsterneGeometry, wall_material);
    MuraEsterne.position.x = 7.5;
    MuraEsterne.position.y = 3.5;
    scene.add(MuraEsterne);
    mura.push(MuraEsterne);
    //Mura interne
    var MuraInterneGeometry = drawMura(5, 5, 5, true);
    var MuraInterneMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
    MuraInterne = new THREE.Mesh(MuraInterneGeometry, wall_material);
    MuraInterne.position.x = 7.5;
    MuraInterne.position.y = 3.5;
    MuraInterne.position.z = 5;
    scene.add(MuraInterne);
    mura.push(MuraInterne);


    //ORIENTAMENTO MURA CON PORTE

    /*          N
     *    -------------
     *   |             |
     *   |             |
     * O |             | E
     *   |             |
     *   |  <-spawn    |
     *    -------------
     *          S
     * 
     */


    var MuroConPortaGeometry = drawMuroConPortaED(1.59, 1.82, 1.59, 0.4);

    //MuraConPorta NORD
    PortaN = new THREE.Mesh(MuroConPortaGeometry);
    PortaN.position.x = 0.8;
    PortaN.position.y = 3.5;
    PortaN.position.z = 7.5;
    scene.add(PortaN);
    mura.push(PortaN);

    // PIAZZAMENTO LUCI TORCE PORTA NORD
    pointLightGenerator(PortaN.position.x, PortaN.position.z - torch_distance);
    pointLightGenerator(PortaN.position.x + 1.82 + 1.59, PortaN.position.z - torch_distance);
    pointLightGenerator(PortaN.position.x, PortaN.position.z + torch_distance);
    pointLightGenerator(PortaN.position.x + 1.82 + 1.59, PortaN.position.z + torch_distance);

    //MuraConPorta SUD = FARETTO
    PortaS = new THREE.Mesh(MuroConPortaGeometry, wall_material);
    PortaS.position.x = 10.8;
    PortaS.position.y = 3.5;
    PortaS.position.z = 7.5;
    scene.add(PortaS);
    mura.push(PortaS);

    // PIAZZAMENTO LUCI TORCE PORTA SUD
    pointLightGenerator(PortaS.position.x, PortaS.position.z - torch_distance);
    pointLightGenerator(PortaS.position.x + 1.82 + 1.59, PortaS.position.z - torch_distance);

    //MuraConPorta EST
    PortaE = new THREE.Mesh(MuroConPortaGeometry, wall_material);
    //PortaE.position.x = 0.8;
    PortaE.rotation.y = -Math.PI / 2;
    PortaE.position.x = 7.5;
    PortaE.position.y = 3.5;
    PortaE.position.z = 0.8;
    scene.add(PortaE);
    mura.push(PortaE);

    // PIAZZAMENTO LUCI TORCE PORTA EST
    pointLightGenerator(PortaE.position.x - torch_distance, PortaE.position.z);
    pointLightGenerator(PortaE.position.x - torch_distance, PortaE.position.z + (1.82 + 1.59));
    pointLightGenerator(PortaE.position.x + torch_distance, PortaE.position.z);
    pointLightGenerator(PortaE.position.x + torch_distance, PortaE.position.z + (1.82 + 1.59));

    //MuraConPorta OVEST
    PortaO = new THREE.Mesh(MuroConPortaGeometry, wall_material);
    PortaO.rotation.y = -Math.PI / 2;
    PortaO.position.x = 7.5;
    PortaO.position.y = 3.5;
    PortaO.position.z = 10.8;
    scene.add(PortaO);
    mura.push(PortaO);


    // PIAZZAMENTO LUCI TORCE PORTA OVEST
    pointLightGenerator(PortaO.position.x - torch_distance, PortaO.position.z);
    pointLightGenerator(PortaO.position.x - torch_distance, PortaO.position.z + (1.82 + 1.59));
    pointLightGenerator(PortaO.position.x + torch_distance, PortaO.position.z);
    pointLightGenerator(PortaO.position.x + torch_distance, PortaO.position.z + (1.82 + 1.59));

    //Porta
    var Porta_ChiusaGeometry = new THREE.BoxGeometry(0.2, 3, 1.8);
    //Porta_Chiusa = new THREE.Mesh(Porta_ChiusaGeometry, new THREE.MeshBasicMaterial({color: 0xff00ff}));
    Porta_Chiusa = new THREE.Mesh(Porta_ChiusaGeometry, wall_material);
    Porta_Chiusa.position.x = 9.88;
    Porta_Chiusa.position.y = 2.5;
    Porta_Chiusa.position.z = 8.8;
    scene.add(Porta_Chiusa);
    mura.push(Porta_Chiusa);
}

/////////////////

function drawMura(x1, y1, z1, brick)
{

    var transformMatrix = new THREE.Matrix4();
    var muro = new THREE.BoxGeometry(x1, y1, 0.01);
    var MuroOvest = new THREE.BoxGeometry(0.01, y1, z1);
    transformMatrix.makeTranslation(-x1 / 2, 0, z1 / 2);
    MuroOvest.applyMatrix(transformMatrix);
    var MuroEst;
    if (brick)
    {
        //con una Matrix4 posso applicare le trasformazioni direttamente alla geometria
        transformMatrix.makeTranslation(3.3, 0, 0);
        var stipiteDestro = new THREE.BoxGeometry(3.05, 5, 0.01);
        stipiteDestro.applyMatrix(transformMatrix);
        //1.5 = metà altezza porta, perchè??? boh
        transformMatrix.makeTranslation(0.975, 1.5, 0);
        var traversa = new THREE.BoxGeometry(1.6, 2, 0.01);
        traversa.applyMatrix(transformMatrix);
        MuroEst = new THREE.BoxGeometry(0.35, 5, 0.01);
        MuroEst.merge(traversa);
        MuroEst.merge(stipiteDestro);
        transformMatrix.makeRotationY(Math.PI / 2);
        MuroEst.applyMatrix(transformMatrix);
        transformMatrix.makeTranslation(x1 / 2, 0, 4.825);
        MuroEst.applyMatrix(transformMatrix);
    }
    else
    {
        MuroEst = new THREE.BoxGeometry(0.01, y1, z1);
        transformMatrix.makeTranslation(x1 / 2, 0, z1 / 2);
        MuroEst.applyMatrix(transformMatrix);
    }


    var MuroSud = new THREE.BoxGeometry(x1, y1, 0.01);
    transformMatrix.makeTranslation(0, 0, z1);
    MuroSud.applyMatrix(transformMatrix);
    muro.merge(MuroSud);
    muro.merge(MuroEst);
    muro.merge(MuroOvest);
    return muro;
}

function drawMuraInterne(x1, y1, z1, x2, y2, z2)
{
    var square = new THREE.Geometry();
    square.vertices.push(new THREE.Vector3(x1, y1, z1)); //0
    square.vertices.push(new THREE.Vector3(x2, y1, z1)); //1
    square.vertices.push(new THREE.Vector3(x2, y2, z1)); //2
    square.vertices.push(new THREE.Vector3(x1, y2, z1)); //3

    square.vertices.push(new THREE.Vector3(x1, y1, z2)); //4
    square.vertices.push(new THREE.Vector3(x1, y2, z2)); //5

    square.vertices.push(new THREE.Vector3(x2, y2, z2)); //6
    square.vertices.push(new THREE.Vector3(x2, y1, z2)); //7

    square.vertices.push(new THREE.Vector3(x2, y1, z1 + 4.5)); //8
    square.vertices.push(new THREE.Vector3(x2, y1 + 3, z1 + 4.5)); //9
    square.vertices.push(new THREE.Vector3(x2, y2, z1 + 4.5)); //10
    square.vertices.push(new THREE.Vector3(x2, y1, z1 + 3)); //11
    square.vertices.push(new THREE.Vector3(x2, y1 + 3, z1 + 3)); //12
    square.vertices.push(new THREE.Vector3(x2, y2, z1 + 3)); //13

    //Faccia Nord
    square.faces.push(new THREE.Face3(0, 1, 2));
    square.faces.push(new THREE.Face3(0, 2, 3));
    //Faccia Ovest
    square.faces.push(new THREE.Face3(0, 3, 4));
    square.faces.push(new THREE.Face3(3, 4, 5));
    //Faccia Sud
    square.faces.push(new THREE.Face3(4, 5, 6));
    square.faces.push(new THREE.Face3(4, 6, 7));
    //Faccia Est

    square.faces.push(new THREE.Face3(6, 7, 8));
    square.faces.push(new THREE.Face3(6, 8, 10));
    square.faces.push(new THREE.Face3(10, 9, 12));
    square.faces.push(new THREE.Face3(10, 12, 13));
    square.faces.push(new THREE.Face3(13, 11, 1));
    square.faces.push(new THREE.Face3(13, 1, 2));
    return square;
}

//sD, tr, sS = lunghezza stipite Destro, traversa, stipiteSinistro
//sp = spessore mesh
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