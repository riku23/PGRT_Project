//GRIGIO
var grigio;
var grigio = new THREE.Color().setHSL(0,0,0.2);

//COLORI PRIMARI
var rosso,blu,giallo;
var rossoscuro, bluscuro,gialloscuro;

rosso = new THREE.Color().setHSL(0,1.0,0.5);
    
blu = new THREE.Color().setHSL(0.67,1.0,0.5);
    
giallo = new THREE.Color().setHSL(0.17,1.0,0.5);
    
 rossoscuro = new THREE.Color();
satura(rosso,grigio,rossoscuro);

 bluscuro = new THREE.Color();
satura(blu,grigio,bluscuro);

 gialloscuro = new THREE.Color();
satura(giallo,grigio,gialloscuro);


//COLORI SECONDARI
var viola,arancione,verde;
var violascuro, arancionescuro, verdescuro;

arancione = new THREE.Color();
addColors(rosso,giallo,arancione);
   
viola = new THREE.Color();
addColors(rosso,blu,viola);
    
verde = new THREE.Color();
addColors(giallo,blu,verde);


arancionescuro = new THREE.Color();
satura(arancione,grigio,arancionescuro);
   
violascuro = new THREE.Color();
satura(viola,grigio,violascuro);
    
verdescuro = new THREE.Color();
satura(verde,grigio,verdescuro);


//COLORI TERZIARI
var violablu, violarosso;
var arancionerosso, arancionegiallo;
var verdeblu, verdegiallo;
var violabluscuro, violarossoscuro;
var arancionerossoscuro, arancionegialloscuro;
var verdebluscuro, verdegialloscuro;


violablu = new THREE.Color();
addColors(viola,blu,violablu);

violarosso = new THREE.Color();
addColors(viola,rosso,violarosso);

arancionerosso = new THREE.Color();
addColors(arancione,rosso,arancionerosso);

arancionegiallo = new THREE.Color();
addColors(arancione,giallo,arancionegiallo);

verdeblu = new THREE.Color();
addColors(verde,blu,verdeblu);

verdegiallo = new THREE.Color();
addColors(verde,giallo,verdegiallo);

violabluscuro = new THREE.Color();
satura(violablu,grigio,violabluscuro);

violarossoscuro = new THREE.Color();
satura(violarosso,grigio,violarossoscuro);

arancionerossoscuro = new THREE.Color();
satura(arancionerosso,grigio,arancionerossoscuro);

arancionegialloscuro = new THREE.Color();
satura(arancionegiallo,grigio,arancionegialloscuro);

verdegialloscuro = new THREE.Color();
satura(verdegiallo,grigio,verdegialloscuro);

verdebluscuro = new THREE.Color();
satura(verdeblu,grigio,verdebluscuro);


var filtroRisultato, filtroRosso, filtroRosso2, fitroGiallo, filtroGiallo2, filtroBlu, filtroBlu2, filtroSaturazione;


function parseName(name1,name2){
    
    //NOMI COLORI PRIMARI
    if((name1=="rosso" && name2=="rosso")){
        return "rosso";
    }
      if((name1=="giallo" && name2=="giallo")){
        return "giallo";
    }
      if((name1=="blu" && name2=="blu")){
        return "blu";
    }

    //NOMI COLORI SECONDARI + SCURI
    if((name1=="rosso" && name2=="giallo") || (name1=="giallo" && name2=="rosso") ){
        return "arancione";
    }
    if((name1=="rosso" && name2=="blu") || (name1=="blu" && name2=="rosso") ){
        return "viola";
    }
    if((name1=="giallo" && name2=="blu") || (name1=="blu" && name2=="giallo") ){
        return "verde";
    }
      if((name1=="gialloscuro" && name2=="blu") || (name1=="bluscuro" && name2=="giallo") ){
        return "verdescuro";
    }
    if((name1=="rossoscuro" && name2=="blu") || (name1=="bluscuro" && name2=="rosso") ){
        return "violascuro";
    }
    if((name1=="rossoscuro" && name2=="giallo") || (name1=="gialloscuro" && name2=="rosso") ){
        return "arancionescuro";
    }

    //NOMI COLORI TERZIARI
    if((name1=="arancione" && name2=="giallo") || (name1=="giallo" && name2=="arancione") ){
        return "arancionegiallo";
    }
     if((name1=="arancione" && name2=="rosso") || (name1=="rosso" && name2=="arancione") ){
        return "arancionerosso";
    }

    if((name1=="verde" && name2=="blu") || (name1=="blu" && name2=="verde") ){
        return "verdeblu";
    }
    if((name1=="verde" && name2=="giallo") || (name1=="giallo" && name2=="verde") ){
        return "verdegiallo";
    }
      if((name1=="viola" && name2=="blu") || (name1=="blu" && name2=="viola") ){
        return "violablu";
    }
       if((name1=="viola" && name2=="rosso") || (name1=="rosso" && name2=="viola") ){
        return "violarosso";
    }

}




function satura(color1, color2, colorResult){
    colorResult.setHSL(color1.getHSL().h,color1.getHSL().s,color2.getHSL().l);
}

function addColors(color1, color2, colorResult){
        a0 = color1.getHSL().h*360;
        a1 = color2.getHSL().h*360;
        r0 = (a0+a1)/2.; 
        r1 = ((a0+a1+360)/2.)%360; 
        console.log(r0,r1);
        if(Math.min(Math.abs(a1-r0), Math.abs(a0-r0)) < Math.min(Math.abs(a0-r1), Math.abs(a1-r1))){
        colorResult.setHSL(r0/360,1.0,Math.min(color1.getHSL().l,color2.getHSL().l));
        }
        else{
        
        colorResult.setHSL(r1/360,1.0,Math.min(color1.getHSL().l,color2.getHSL().l));
        }
    }


function combine() {
    if(livello==1){
        alert("Al livello 1 non si combina");
    }else{
        if((( inventario[0] && !inventario[1] ) || ( !inventario[0] && inventario[1] )) && inventario[2]){
            if(inventario[inventarioPos]==null){
                alert("seleziona un filtro");
                return;
            }
            satura(inventario[inventarioPos].material.color,inventario[2].material.color,filtroRisultato.material.color);
            var nome =inventario[inventarioPos].name + "scuro";
            if(nome==null){
                alert("colore non valido");               
                nuovoLivello(livello);
                return;
            }
            svuotaInventario();
            console.log(nome);
            document.getElementById("inventory1").style.backgroundImage = "url(textures/inventario/" + nome + ".jpg)";
            filtroRisultato.name= nome;
            inventario[0] = filtroRisultato;

        }else{
            if(inventario[0] && inventario[1] && !inventario[2]){
                addColors(inventario[0].material.color,inventario[1].material.color,filtroRisultato.material.color);
                var nome = parseName(inventario[0].name,inventario[1].name);
                if(nome==null){
                alert("colore non valido");
                nuovoLivello(livello);

                return;
            }
                svuotaInventario();
                console.log(nome);
                document.getElementById("inventory1").style.backgroundImage = "url(textures/inventario/" + nome + ".jpg)";
                filtroRisultato.name= nome;
                inventario[0] = filtroRisultato;

}
        else{
            if(inventario[0] && inventario[1] && inventario[2]){
                addColors(inventario[0].material.color,inventario[1].material.color,filtroRisultato.material.color);
                var nome = parseName(inventario[0].name,inventario[1].name);
                if(nome==null){
                alert("colore non valido");
                nuovoLivello(livello);
                return;
            }
                console.log(nome);
                document.getElementById("inventory1").style.backgroundImage = "url(textures/inventario/" + nome + ".jpg)";
                filtroRisultato.name= nome;
                inventario[0] = filtroRisultato;

                satura(inventario[0].material.color,inventario[2].material.color,filtroRisultato.material.color);
                var nome =inventario[0].name + "scuro";
                svuotaInventario();
                console.log(nome);
                document.getElementById("inventory1").style.backgroundImage = "url(textures/inventario/" + nome + ".jpg)";
                filtroRisultato.name= nome;
                inventario[0] = filtroRisultato;



            }}}
        }}

    


function colorePorta(livello){
    switch(livello){
        case 1:
            var doorColor = new THREE.Color(rosso);
            Porta_Chiusa.material.color = doorColor;
            break;


        case 2:
            var doorColor = new THREE.Color(verde);
            Porta_Chiusa.material.color = doorColor;
            break;

        case 3:
            var doorColor = new THREE.Color(arancionescuro);
            Porta_Chiusa.material.color = doorColor;
            break;

        case 4:
            var doorColor = new THREE.Color(violablu);
            Porta_Chiusa.material.color = doorColor;
            break;

        case 5:
            var doorColor = new THREE.Color(verdegialloscuro);
            Porta_Chiusa.material.color = doorColor;
            break;

    }
}


