//GRIGIO
var grigio;
var grigio = new THREE.Color().setHSL(0,0,0.1);

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


function satura(color1, color2, colorResult){
    colorResult.setHSL(color1.getHSL().h,color1.getHSL().s,(color1.getHSL().l-color2.getHSL().l));
}

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


function combine() {
    if(livello==1){
        alert("Al livello 1 non si combina");
    }else{
        if((( inventario[0] && !inventario[1] ) || ( !inventario[0] && inventario[1] )) && inventario[2]){
            if(inventario[inventarioPos]==null){
                alert("seleziona un filtro");
                return;
            }
            satura(inventario[inventarioPos].material.color,inventario[2].material.color,inventario[inventarioPos].material.color);
            //svuotaInventario();
            inventario[0] = inventario[inventarioPos];
            inventario[1] = null;
            inventario[2] = null;
            document.getElementById("inventory1").style.backgroundColor = "#"+inventario[0].material.color.getHexString();
            document.getElementById("inventory2").style.backgroundColor = "";
            document.getElementById("inventory3").style.backgroundColor = "";

        }else{
            if(inventario[0] && inventario[1] && !inventario[2]){
                addColors(inventario[0].material.color,inventario[1].material.color,inventario[0].material.color);
                //inventario[0] = filtroRisultato;
                inventario[1] = null;
                document.getElementById("inventory1").style.backgroundColor = "#"+inventario[0].material.color.getHexString();
                document.getElementById("inventory2").style.backgroundColor = "";

}
        else{
            if(inventario[0] && inventario[1] && inventario[2]){
                addColors(inventario[0].material.color,inventario[1].material.color,inventario[0].material.color);
                satura(inventario[0].material.color,inventario[2].material.color,inventario[0].material.color);
                inventario[1] = null;
                inventario[2] = null;
                document.getElementById("inventory1").style.backgroundColor = "#"+inventario[0].material.color.getHexString();
                document.getElementById("inventory2").style.backgroundColor = "";
                document.getElementById("inventory3").style.backgroundColor = "";



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


