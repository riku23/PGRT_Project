function set_ambient_items(){
	//FARO

    //creo la mesh prima per averne già la posizione da usare in spotLightPlacing()
    faro = new THREE.Mesh();
    faro.position.set(14.45, 1.6, 9);
    var loader = new THREE.JSONLoader();
    loader.load("models/faro2.js", function (geometry, materials) {
        // applico i materiali definiti all'interno del modello
        var materials = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('textures/steel.jpg')});
        faro.geometry = geometry;
        faro.material = materials;

        // ruoto il modello di 180Â° sull'asse Y
        faro.rotation.x = Math.PI / 2;
        faro.rotation.z = Math.PI / 2.5;

        // lo scalo per metterlo in scala con la scena
        faro.scale.set(0.02, 0.02, 0.02);
        mura.push(faro);
        oggettiPrendibili.push(faro);
        geometry.computeBoundingBox();
        scene.add(faro);

    });



 	var tavoloMaterial = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});


    //TAVOLO Sud-Est
    tavoloSE = new THREE.Mesh();
    tavoloSE.position.set(14, 1, 1);
    
    tavoloNO = new THREE.Mesh();
    tavoloNO.position.set(1, 1, 14);

    tavoloNE = new THREE.Mesh();
    tavoloNE.position.set(1, 1, 1);

    tavoloSO = new THREE.Mesh();
    tavoloSO.position.set(14, 1, 14);

    loader.load("models/tavolo2.js", function (geometry, materials) {
        
    	//TAVOLO SUD OVEST
        tavoloSO.geometry = geometry;
        tavoloSO.material = tavoloMaterial;
        tavoloSO.rotation.x = -Math.PI/2;
        tavoloSO.scale.set(0.035, 0.04, 0.035);
        mura.push(tavoloSO);
        scene.add(tavoloSO);


        //TAVOLO SUD EST
        tavoloSE.geometry = geometry;
        tavoloSE.material = tavoloMaterial;
        tavoloSE.rotation.x = -Math.PI/2;
        tavoloSE.scale.set(0.035, 0.035, 0.035);
        mura.push(tavoloSE);
        scene.add(tavoloSE);

        //TAVOLO NORD OVEST
        tavoloNO.geometry = geometry;
        tavoloNO.material = tavoloMaterial;
        tavoloNO.rotation.x = -Math.PI/2;
        tavoloNO.scale.set(0.035, 0.04, 0.035);
        mura.push(tavoloNO);
        scene.add(tavoloNO);

        //TAVOLO NORD EST
        tavoloNE.geometry = geometry;
        tavoloNE.material = tavoloMaterial;
        tavoloNE.rotation.x = -Math.PI/2;
        tavoloNE.scale.set(0.035, 0.04, 0.035);
        mura.push(tavoloNE);
        scene.add(tavoloNE);


        abilitaMovimento=true;
    });

	

	var torciaMaterial = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('textures/wood.jpg')});

    //torcia NO1
    torciaNO1 = new THREE.Mesh();
    torciaNO1.position.set(7, 3, PortaO.z);
    //torcia NO2
    torciaNO2 = new THREE.Mesh();
    torciaNO2.position.set(7, 3, PortaO.z+1.82+1.59);
    //torcia NO3
    torciaNO3 = new THREE.Mesh();
    torciaNO3.position.set(PortaN.x+1.82+1.59, 3, 8 );
    //torcia NO4
    torciaNO4 = new THREE.Mesh();
    torciaNO4.position.set(PortaN.x, 3,8 );
    
    //torcia NE1
    torciaNE1 = new THREE.Mesh();
    torciaNE1.position.set(PortaN.x, 3, 7);
    //torcia NE2
    torciaNE2 = new THREE.Mesh();
    torciaNE2.position.set((PortaN.x+1.82+1.59), 3, 7);
    //torcia NE3
    torciaNE3 = new THREE.Mesh();
    torciaNE3.position.set(7, 3, PortaE.z);
    //torcia NE4
    torciaNE4 = new THREE.Mesh();
    torciaNE4.position.set(7, 3, (PortaE.z+1.82+1.59));
    
    //torcia SE1
    torciaSE1 = new THREE.Mesh();
    torciaSE1.position.set(8, 3, PortaE.z);
    //torcia SE2
    torciaSE2 = new THREE.Mesh();
    torciaSE2.position.set(8, 3, PortaE.z+1.82+1.59);
    //torcia SE3
    torciaSE3 = new THREE.Mesh();
    torciaSE3.position.set(PortaS.x, 3, 7);
    //torcia SE4
    torciaSE4 = new THREE.Mesh();
    torciaSE4.position.set(PortaS.x+1.82+1.59, 3, 7);
    
    //torcia SO3
    torciaSO3 = new THREE.Mesh();
    torciaSO3.position.set(8, 3, PortaO.z+1.82+1.59);
    //torcia SO4
    torciaSO4 = new THREE.Mesh();
    torciaSO4.position.set(8, 3, PortaO.z);


    loader.load("models/torcia.js", function (geometry, materials) {
    	
    	//TORCIA NO1
        torciaNO1.geometry = geometry;
        torciaNO1.material = torciaMaterial;
        torciaNO1.rotation.y = -Math.PI/2;
        torciaNO1.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNO1);
        scene.add(torciaNO1);

       	//TORCIA NO2
        torciaNO2.geometry = geometry;
        torciaNO2.material = torciaMaterial;
        torciaNO2.rotation.y = -Math.PI/2;
        torciaNO2.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNO2);
        scene.add(torciaNO2);

        //TORCIA NO3
        torciaNO3.geometry = geometry;
        torciaNO3.material = torciaMaterial;
        torciaNO3.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNO3);
        scene.add(torciaNO3);

        //TORCIA NO4
        torciaNO4.geometry = geometry;
        torciaNO4.material = torciaMaterial;
        torciaNO4.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNO4);
        scene.add(torciaNO4);

        //TORCIA NE1
        torciaNE1.geometry = geometry;
        torciaNE1.material = torciaMaterial;
        torciaNE1.rotation.y = Math.PI;
        torciaNE1.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNE1);
        scene.add(torciaNE1);

        //TORCIA NE2
        torciaNE2.geometry = geometry;
        torciaNE2.material = torciaMaterial;
        torciaNE2.rotation.y = Math.PI;
        torciaNE2.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNE2);
        scene.add(torciaNE2);

        //TORCIA NE3
        torciaNE3.geometry = geometry;
        torciaNE3.material = torciaMaterial;
        torciaNE3.rotation.y = -Math.PI/2;
        torciaNE3.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNE3);
        scene.add(torciaNE3);

        //TORCIA NE4;
        torciaNE4.geometry = geometry;
        torciaNE4.material = torciaMaterial;
        torciaNE4.rotation.y = -Math.PI/2;
        torciaNE4.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaNE4);
        scene.add(torciaNE4);

  		//TORCIA SE1
        torciaSE1.geometry = geometry;
        torciaSE1.material = torciaMaterial;
        torciaSE1.rotation.y = Math.PI/2;
        torciaSE1.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSE1);
        scene.add(torciaSE1);

        //TORCIA SE2
        torciaSE2.geometry = geometry;
        torciaSE2.material = torciaMaterial;
        torciaSE2.rotation.y = Math.PI/2;
        torciaSE2.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSE2);
        scene.add(torciaSE2);

        //TORCIA SE3
        torciaSE3.geometry = geometry;
        torciaSE3.material = torciaMaterial;
        torciaSE3.rotation.y = Math.PI;
        torciaSE3.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSE3);
        scene.add(torciaSE3);


        //TORCIA SE4
        torciaSE4.geometry = geometry;
        torciaSE4.material = torciaMaterial;
        torciaSE4.rotation.y = Math.PI;
        torciaSE4.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSE4);
        scene.add(torciaSE4);

        //TORCIA SO3
        torciaSO3.geometry = geometry;
        torciaSO3.material = torciaMaterial;
        torciaSO3.rotation.y = Math.PI/2;
        torciaSO3.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSO3);
        scene.add(torciaSO3);

        //TORCIA SO4
        torciaSO4.geometry = geometry;
        torciaSO4.material = torciaMaterial;
        torciaSO4.rotation.y = Math.PI/2;
        torciaSO4.scale.set(0.01, 0.01, 0.01);
        mura.push(torciaSO4);
        scene.add(torciaSO4);

    });

    computeShadow(tavoloSO);
    computeShadow(tavoloSE);
    computeShadow(tavoloNO);
    computeShadow(tavoloNE);
    computeShadow(faro);



}

function createFiltri(){
                var filterTexture = THREE.ImageUtils.loadTexture('textures/filtro.jpg');
                //filtro Risultato
                var filterColor = new THREE.Color().setHSL(0,1.0,0.5);
                filtroRisultato = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshBasicMaterial({map: filterTexture , color: filterColor}));
                filtroRisultato.position.set(100,100, 100);
                filtroRisultato.name="res";
                oggettiPrendibili.push(filtroRisultato);
                mura.push(filtroRisultato);
                scene.add(filtroRisultato);




                //  filtro Rosso
                var filterColor = new THREE.Color(rosso);
                filtroRosso = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshPhongMaterial({map: filterTexture, color: filterColor}));
                filtroRosso.position.set(100,100, 100);
                filtroRosso.color = filterColor;
                oggettiPrendibili.push(filtroRosso);
                mura.push(filtroRosso);
                scene.add(filtroRosso);

                //  filtro Rosso 2
                var filterColor = new THREE.Color(rosso);
                filtroRosso2 = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshPhongMaterial({map: filterTexture, color: filterColor}));
                filtroRosso2.position.set(100,100, 100);
                filtroRosso2.color = filterColor;
                oggettiPrendibili.push(filtroRosso2);
                mura.push(filtroRosso2);
                scene.add(filtroRosso2);


                //  filtro Blu
                var filterColor = new THREE.Color(blu);
                filtroBlu = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshPhongMaterial({map: filterTexture, color: filterColor}));
                filtroBlu.position.set(100,100,100);
                oggettiPrendibili.push(filtroBlu);
                mura.push(filtroBlu);
                scene.add(filtroBlu); 

                      //  filtro Blu 2
                var filterColor = new THREE.Color(blu);
                filtroBlu2 = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshPhongMaterial({map: filterTexture, color: filterColor}));
                filtroBlu2.position.set(100,100,100);
                oggettiPrendibili.push(filtroBlu2);
                mura.push(filtroBlu2);
                scene.add(filtroBlu2); 

                //  filtro Giallo
                var filterColor = new THREE.Color(giallo);
                filtroGiallo = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshPhongMaterial({map: filterTexture, color: filterColor}));
                filtroGiallo.position.set(100,100,100);
                oggettiPrendibili.push(filtroGiallo);
                mura.push(filtroGiallo);
                scene.add(filtroGiallo); 

                 //  filtro Giallo 2
                var filterColor = new THREE.Color(giallo);
                filtroGiallo2 = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshPhongMaterial({map: filterTexture, color: filterColor}));
                filtroGiallo2.position.set(100,100,100);
                oggettiPrendibili.push(filtroGiallo2);
                mura.push(filtroGiallo2);
                scene.add(filtroGiallo2); 


                //  filtro Saturazione
                var filterColor = new THREE.Color().setHSL(0,0,0.1);
                filtroSaturazione = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshPhongMaterial({map: filterTexture, color: filterColor}));
                filtroSaturazione.position.set(100,100,100);
                filtroSaturazione.name="saturazione";
                oggettiPrendibili.push(filtroSaturazione);
                mura.push(filtroSaturazione);
                scene.add(filtroSaturazione); 

                 //  filtro Saturazione 2
                var filterColor = new THREE.Color().setHSL(0,0,0.1);
                filtroSaturazione2 = new THREE.Mesh(
                new THREE.BoxGeometry(.001, .4, .4),
                new THREE.MeshPhongMaterial({map: filterTexture, color: filterColor}));
                filtroSaturazione2.position.set(100,100,100);
                filtroSaturazione2.name="saturazione";
                oggettiPrendibili.push(filtroSaturazione2);
                mura.push(filtroSaturazione2);
                scene.add(filtroSaturazione2); 


                computeShadow(filtroRosso);
                computeShadow(filtroRosso2);
                computeShadow(filtroBlu);
                computeShadow(filtroBlu2);
                computeShadow(filtroGiallo);
                computeShadow(filtroGiallo2);
                computeShadow(filtroSaturazione);
                computeShadow(filtroSaturazione2);

}

function setFiltri(livello){
    switch( livello ) {
        case 1:
    
                filtroRosso.position.set(1, 2.4, 1);
                
                filtroBlu.position.set(1, 2.4, 14);

                filtroGiallo.position.set(14, 2.4, 1);
                
                break;

        case 2:             
              
                filtroRosso.position.set(1, 2.4, 0.5);
                filtroRosso.rotation.y = -Math.PI/4;
                filtroRosso.material.color.setHSL(0,1.0,0.5);
              
                filtroRosso2.position.set(1, 2.4, 1.5);
                filtroRosso2.rotation.y = Math.PI/4;
                filtroRosso2.material.color.setHSL(0,1.0,0.5);
                
                filtroBlu.position.set(1, 2.4, 13.5);
                filtroBlu.rotation.y = -Math.PI/4;
                filtroBlu.material.color.setHSL(0.67,1.0,0.5);

                filtroBlu2.position.set(1, 2.4, 14.5);
                filtroBlu2.rotation.y = Math.PI/4;
                filtroBlu2.material.color.setHSL(0.67,1.0,0.5);

                filtroGiallo.position.set(14, 2.4, 0.5);
                filtroGiallo.rotation.y = Math.PI/4;
                filtroGiallo.material.color.setHSL(0.17,1.0,0.5);

                filtroGiallo2.position.set(14, 2.4, 1.5);
                filtroGiallo2.rotation.y = -Math.PI/4;
                filtroGiallo2.material.color.setHSL(0.17,1.0,0.5);

                break;

        case 3:             
              
                filtroRosso.position.set(1, 2.4, 0.5);
                filtroRosso.rotation.y = -Math.PI/4;
                filtroRosso.material.color.setHSL(0,1.0,0.5);
              
                filtroRosso2.position.set(1, 2.4, 1.5);
                filtroRosso2.rotation.y = Math.PI/4;
                filtroRosso2.material.color.setHSL(0,1.0,0.5);
                
                filtroBlu.position.set(1, 2.4, 13.5);
                filtroBlu.rotation.y = -Math.PI/4;
                filtroBlu.material.color.setHSL(0.67,1.0,0.5);

                filtroBlu2.position.set(1, 2.4, 14.5);
                filtroBlu2.rotation.y = Math.PI/4;
                filtroBlu2.material.color.setHSL(0.67,1.0,0.5);

                filtroGiallo.position.set(14, 2.4, 0.5);
                filtroGiallo.rotation.y = Math.PI/4;
                filtroGiallo.material.color.setHSL(0.17,1.0,0.5);

                filtroGiallo2.position.set(14, 2.4, 1.5);
                filtroGiallo2.rotation.y = -Math.PI/4;
                filtroGiallo2.material.color.setHSL(0.17,1.0,0.5);

                filtroSaturazione.position.set(14,2.4,13.5);
                filtroSaturazione.rotation.y = Math.PI/4;
                filtroSaturazione.material.color.setHSL(0,0,0.1);

                filtroSaturazione2.position.set(14,2.4,14.5);
                filtroSaturazione2.rotation.y = -Math.PI/4;
                filtroSaturazione2.material.color.setHSL(0,0,0.1);
                
                break;

         case 4:             
              
                filtroRosso.position.set(1, 2.4, 0.5);
                filtroRosso.rotation.y = -Math.PI/4;
                filtroRosso.material.color.setHSL(0,1.0,0.5);
              
                filtroRosso2.position.set(1, 2.4, 1.5);
                filtroRosso2.rotation.y = Math.PI/4;
                filtroRosso2.material.color.setHSL(0,1.0,0.5);
                
                filtroBlu.position.set(1, 2.4, 13.5);
                filtroBlu.rotation.y = -Math.PI/4;
                filtroBlu.material.color.setHSL(0.67,1.0,0.5);

                filtroBlu2.position.set(1, 2.4, 14.5);
                filtroBlu2.rotation.y = Math.PI/4;
                filtroBlu2.material.color.setHSL(0.67,1.0,0.5);

                filtroGiallo.position.set(14, 2.4, 0.5);
                filtroGiallo.rotation.y = Math.PI/4;
                filtroGiallo.material.color.setHSL(0.17,1.0,0.5);

                filtroGiallo2.position.set(14, 2.4, 1.5);
                filtroGiallo2.rotation.y = -Math.PI/4;
                filtroGiallo2.material.color.setHSL(0.17,1.0,0.5);

                filtroSaturazione.position.set(14,2.4,13.5);
                filtroSaturazione.rotation.y = Math.PI/4;
                filtroSaturazione.material.color.setHSL(0,0,0.1);

                filtroSaturazione2.position.set(14,2.4,14.5);
                filtroSaturazione2.rotation.y = -Math.PI/4;
                filtroSaturazione2.material.color.setHSL(0,0,0.1);
                
                
                break;

        case 5:             
              
             filtroRosso.position.set(1, 2.4, 0.5);
                filtroRosso.rotation.y = -Math.PI/4;
                filtroRosso.material.color.setHSL(0,1.0,0.5);
              
                filtroRosso2.position.set(1, 2.4, 1.5);
                filtroRosso2.rotation.y = Math.PI/4;
                filtroRosso2.material.color.setHSL(0,1.0,0.5);
                
                filtroBlu.position.set(1, 2.4, 13.5);
                filtroBlu.rotation.y = -Math.PI/4;
                filtroBlu.material.color.setHSL(0.67,1.0,0.5);

                filtroBlu2.position.set(1, 2.4, 14.5);
                filtroBlu2.rotation.y = Math.PI/4;
                filtroBlu2.material.color.setHSL(0.67,1.0,0.5);

                filtroGiallo.position.set(14, 2.4, 0.5);
                filtroGiallo.rotation.y = Math.PI/4;
                filtroGiallo.material.color.setHSL(0.17,1.0,0.5);

                filtroGiallo2.position.set(14, 2.4, 1.5);
                filtroGiallo2.rotation.y = -Math.PI/4;
                filtroGiallo2.material.color.setHSL(0.17,1.0,0.5);

                filtroSaturazione.position.set(14,2.4,13.5);
                filtroSaturazione.rotation.y = Math.PI/4;
                filtroSaturazione.material.color.setHSL(0,0,0.1);

                filtroSaturazione2.position.set(14,2.4,14.5);
                filtroSaturazione2.rotation.y = -Math.PI/4;
                filtroSaturazione2.material.color.setHSL(0,0,0.1);
                
                
                break;


    }}