//GRIGIO
var grigio;
var grigio = new THREE.Color().setHSL(0,0,0.1);

//COLORI PRIMARI
var rosso,blu,giallo;


rosso = new THREE.Color().setHSL(0,1.0,0.5);
    
blu = new THREE.Color().setHSL(0.67,1.0,0.5);
    
giallo = new THREE.Color().setHSL(0.17,1.0,0.5);


//funzione che scurisce un colore tramite l'applicazione di un filtro grigio    
function scurisci(color1, color2, colorResult){
    colorResult.setHSL(color1.getHSL().h,color1.getHSL().s,(color1.getHSL().l-color2.getHSL().l));
}
//funzione che combina le tinte di due colori
function addColors(color1, color2, colorResult){
        a0 = color1.getHSL().h*360;
        a1 = color2.getHSL().h*360;
        r0 = (a0+a1)/2.; 
        r1 = ((a0+a1+360)/2.)%360; 
        if(Math.min(Math.abs(a1-r0), Math.abs(a0-r0)) < Math.min(Math.abs(a0-r1), Math.abs(a1-r1))){
        colorResult.setHSL(r0/360,1.0,Math.min(color1.getHSL().l,color2.getHSL().l));
        }
        else{
        
        colorResult.setHSL(r1/360,1.0,Math.min(color1.getHSL().l,color2.getHSL().l));
        }
    }

//funzione che viene chiamata dalla pressione del bottone "combine" e in base allo stato dell'inventario chiama le funzioni scurisci() e addColors() o una sola delle due
//per ottenere la combinazione dei filtri in inventario.
//LA combinazione viene notificata nell' interfaccia
function combine() {
    if(livello==1){
        alert("Al primo livello non è possibile combinare!");
    }else{
        if((( inventario[0] && !inventario[1] ) || ( !inventario[0] && inventario[1] )) && inventario[2]){
            if(inventario[inventarioPos]==null){
                alert("Seleziona un filtro");
                return;
            }
            scurisci(inventario[inventarioPos].material.color,inventario[2].material.color,inventario[inventarioPos].material.color);
            //svuotaInventario();
            inventario[0] = inventario[inventarioPos];
            inventario[1] = null;
            inventario[2] = null;
            document.getElementById("inventory1").style.backgroundColor = "#"+inventario[0].material.color.getHexString();
            document.getElementById("inventory2").style.backgroundColor = "";
            document.getElementById("inventory3").style.backgroundColor = "";
            combineAudio.play();

        }else{
            if(inventario[0] && inventario[1] && !inventario[2]){
                addColors(inventario[0].material.color,inventario[1].material.color,inventario[0].material.color);
                //inventario[0] = filtroRisultato;
                inventario[1] = null;
                document.getElementById("inventory1").style.backgroundColor = "#"+inventario[0].material.color.getHexString();
                document.getElementById("inventory2").style.backgroundColor = "";
                combineAudio.play();

}
        else{
            if(inventario[0] && inventario[1] && inventario[2]){
                addColors(inventario[0].material.color,inventario[1].material.color,inventario[0].material.color);
                scurisci(inventario[0].material.color,inventario[2].material.color,inventario[0].material.color);
                inventario[1] = null;
                inventario[2] = null;
                document.getElementById("inventory1").style.backgroundColor = "#"+inventario[0].material.color.getHexString();
                document.getElementById("inventory2").style.backgroundColor = "";
                document.getElementById("inventory3").style.backgroundColor = "";
                combineAudio.play();



            }}}
        }
        
    }

    

//Funzione che determina il colore della porta per ogni livello creandoli con le stesse funzioni che saranno a disposizione del giocatore per combinare i filtri 
//per poter garantire l'uguaglianza
function colorePorta(livello){
    switch(livello){
        case 1:
            var doorColor = new THREE.Color(rosso);
            Porta_Chiusa.material.color = doorColor;
            break;


        case 2:
            var doorColor = new THREE.Color();
            addColors(giallo,blu,doorColor);
            Porta_Chiusa.material.color = doorColor;
            Porta_Chiusa_Muro.material.color = new THREE.Color(rosso);
            break;

        case 3:
            var doorColor = new THREE.Color();
            addColors(rosso,giallo,doorColor);
            scurisci(doorColor,grigio,doorColor)
            Porta_Chiusa.material.color = doorColor;
            var old_door_color = new THREE.Color();
            addColors(giallo,blu,old_door_color);
            Porta_Chiusa_Muro.material.color = new THREE.Color(old_door_color);
            break;

        case 4:
            var doorColor = new THREE.Color();
            addColors(rosso,blu,doorColor);
            addColors(doorColor,blu,doorColor);
            Porta_Chiusa.material.color = doorColor;
            var old_door_color = new THREE.Color();
            addColors(rosso,giallo,old_door_color);
            scurisci(old_door_color,grigio,old_door_color)
            Porta_Chiusa_Muro.material.color = new THREE.Color(old_door_color);
            break;

        case 5:
            var doorColor = new THREE.Color();
            addColors(giallo,blu,doorColor);
            addColors(doorColor,giallo,doorColor);
            scurisci(doorColor,grigio,doorColor);
            scurisci(doorColor,grigio,doorColor);
            Porta_Chiusa.material.color = doorColor;
            var old_door_color = new THREE.Color();
            addColors(rosso,blu,old_door_color);
            addColors(old_door_color,blu,old_door_color);
            Porta_Chiusa_Muro.material.color = new THREE.Color(old_door_color);
            break;

    }
}


