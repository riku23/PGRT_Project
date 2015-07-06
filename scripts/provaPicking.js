$(document).click(function(e) {
						e.preventDefault;
							
						raycaster.setFromCamera( mouse, camera );
						intersections = raycaster.intersectObjects( oggettiPrendibili );	
						if (e.which ==1){
							if(intersections.length>0 && inventario.length==0){ //inventario vuoto
								//sposto l'oggetto e lo aggiungo all'inventario
								intersected = intersections[ 0 ].object;
				   				var distance = intersections[0].distance;
				   				if(intersected && distance <3){
				   					inventario.push(intersected);
				   					selectedObject = intersected;
				   					intersected.position.x =100;
				   					intersected.position.y =100;
				   					intersected.position.z =100;
				   					oggetti = oggetti + 1;
									$('#oggetti').html(oggetti);
									console.log("preso oggetto inventario vuoto");
				   				}
							}
							if(intersections.length>0 && inventario.length>=filtri){// inventario pieno
								//scambio i due oggetti
								intersected = intersections[ 0 ].object;
				   				var distance = intersections[0].distance;
				   				if(intersected && distance <3){
				   					inventario[0].position.x = intersected.position.x;
				   					inventario[0].position.y = intersected.position.y;
				   					inventario[0].position.z = intersected.position.z;
				   					intersected.position.x =100;
				   					intersected.position.y =100;
				   					intersected.position.z =100;
				   					inventario.pop(inventario[0]);
				   					inventario.push(intersected);
				   					selectedObject = intersected;
				   				}
							}
							if(raycaster.intersectObject(faro).object && raycaster.intersectObject(faro).distance>3 && inventario.length>=1){
								selectedObject.position.x = faro.position.x;
								selectedObject.position.y = faro.position.y+1;
								selectedObject.position.z = faro.position.z;
								inventario.pop(selectedObject);
								oggetti = oggetti - 1;
								$('#oggetti').html(oggetti);
								console.log("posizionato oggetto su faro");



							}

						}
}









						}
						if(e.which == 1 && inventario.length >= filtri && intersections.length > 0){
							raycaster.setFromCamera( mouse, camera );
							intersections = raycaster.intersectObjects( oggettiPrendibili );

				   				intersected = intersections[ 0 ].object;
				   				var distance = intersections[0].distance;
							
									if ( intersected && distance < 3 ){ 
										inventario[0].position.x = intersected.position.x;
										inventario[0].position.y = intersected.position.y;
										inventario[0].position.z = intersected.position.z;
										inventario.pop(inventario[0]);
										inventario.push(intersected);
										intersected.position.x = 100;
										intersected.position.y = 100;
										intersected.position.z = 100;
										console.log("primo if");

						}}else{


						/*if(e.which == 1 && inventario.length >= filtri){
							inventario[0].position.x = oldX;
							inventario[0].position.y = oldY;
							inventario[0].position.z = oldZ;
							inventario.pop(inventario[0]);
							oggetti = oggetti -1;
							$('#oggetti').html(oggetti);
							console.log("secondo if");

						}*/
						
						if (e.which == 1) {
						raycaster.setFromCamera( mouse, camera );
						intersections = raycaster.intersectObjects( oggettiPrendibili );	 
						if ( intersections.length > 0) {

				   		
				   			if(raycaster.intersectObject(faro) && selectedObject){
				   				selectedObject.position.x = 14;
				   				selectedObject.position.y = 4;
				   				selectedObject.position.z = 9;
				   				inventario.pop(selectedObject);
				   			}else{
								intersected = intersections[ 0 ].object;
								var distance = intersections[0].distance;
							if ( intersected && distance < 3 ){ 
    							//removeElement(intersected);
    							oldX = intersected.position.x;
    							oldY = intersected.position.y;
    							oldZ = intersected.position.z;
								intersected.position.x = 100;
								intersected.position.y = 100;
								intersected.position.z = 100;
								inventario.push(intersected);
								oggetti = oggetti + 1;
								$('#oggetti').html(oggetti);
								console.log("terzo if");
							}}}}}});
