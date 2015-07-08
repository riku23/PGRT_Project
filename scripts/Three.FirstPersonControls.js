/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 *
 * Modified from default:
 * - Added this.clickMove, which differentiates between mouse-looking and
 *   click-to-move.
 * - Changed camera movement in this.update() to respect wall collisions
 * - Changed this.update() to use this.noFly to disallow going up/down with R/F
 */

THREE.FirstPersonControls = function ( object, domElement ) {

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	this.movementSpeed = 1.0;
	this.lookSpeed = 0.5;
	this.autoForward = false;
	this.activeLook = true;
	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 180;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;



	if ( this.domElement === document ) {

		this.viewHalfX = window.innerWidth / 2;
		this.viewHalfY = window.innerHeight / 2;

	} else {

		this.viewHalfX = this.domElement.offsetWidth / 2;
		this.viewHalfY = this.domElement.offsetHeight / 2;
		this.domElement.setAttribute( 'tabindex', -1 );

	}



	this.onMouseMove = function ( event ) {
		
		if ( this.domElement == document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;
		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	this.onKeyDown = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;


			case 81: /*Q*/ this.freeze = !this.freeze; break;

			case 32: /*SPACEBAR*/ this.movementSpeed = 10; break;
		}

	};

	

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 80: /*P*/ apriPorta(); break;

			case 32: /*SPACEBAR*/ this.movementSpeed = 5; break;

		}

	};

	this.update = function( delta ) {
		var actualMoveSpeed = 0;
		
		if ( this.freeze ) {
			
			return;
			
		} else {

				var axis = new THREE.Vector3( 0, 1, 0 );
				var angle180 = Math.PI;
				var angle90 = Math.PI/2;
				var angle45 = Math.PI/4;
				var origin = new THREE.Vector3(controls.object.position.x,2.1,controls.object.position.z);
				//RAYCASTER FRONT 1
				var vector1 = controls.target.clone().sub( controls.object.position ).normalize();
				var raycaster1 = new THREE.Raycaster( origin, vector1, 0.5, 1 );
				var intersects1 = raycaster1.intersectObjects( mura );
				
				//RAYCASTER FRONT 45-1
				var vector2 = controls.target.clone().sub( controls.object.position ).normalize();
				vector2.applyAxisAngle(axis,angle45);
                                var raycaster2 = new THREE.Raycaster(origin, vector2, 0.5, 1 );
				var intersects2 = raycaster2.intersectObjects( mura );
				
				//RAYCASTER FRONT 45-2
				var vector3 = controls.target.clone().sub( controls.object.position ).normalize();
				vector3.applyAxisAngle(axis,-angle45);
				var raycaster3 = new THREE.Raycaster( origin, vector3, 0.5, 1 );
				var intersects3 = raycaster3.intersectObjects( mura );

				//RAYCASTER BACK 1
				var vector4 = controls.target.clone().sub( controls.object.position ).normalize();
				vector4.applyAxisAngle(axis,angle180);
				var raycaster4 = new THREE.Raycaster( origin, vector4, 0.5, 1 );
				var intersects4 = raycaster4.intersectObjects( mura );
				
				//RAYCASTER BACK 45-1
				var vector5 = controls.target.clone().sub( controls.object.position ).normalize();
				vector5.applyAxisAngle(axis,angle180+angle45);
				var raycaster5 = new THREE.Raycaster( origin, vector5, 0.5, 1 );
				var intersects5 = raycaster5.intersectObjects( mura );

				//RAYCASTER BACK 45-2
				var vector6 = controls.target.clone().sub( controls.object.position ).normalize();
				vector6.applyAxisAngle(axis,angle180-angle45);
				var raycaster6 = new THREE.Raycaster( origin, vector6, 0.5, 1 );
				var intersects6 = raycaster6.intersectObjects( mura );
				
				//RAYCASTER RIGHT
				var vector7 = controls.target.clone().sub( controls.object.position ).normalize();
				vector7.applyAxisAngle(axis,-angle90);
				var raycaster7 = new THREE.Raycaster( origin, vector7, 0.5, 1 );
				var intersects7 = raycaster7.intersectObjects( mura );
				
				//RAYCASTER LEFT
				var vector8 = controls.target.clone().sub( controls.object.position ).normalize();
				vector8.applyAxisAngle(axis,angle90);
				var raycaster8 = new THREE.Raycaster( origin, vector8, 0.5, 1 );
				var intersects8 = raycaster8.intersectObjects( mura );
				
				
				
				
				
						

			actualMoveSpeed = delta * this.movementSpeed;

			if ( this.moveForward && (intersects1.length == 0 && intersects2.length == 0 && intersects3.length == 0) ) {
				this.object.translateZ( -actualMoveSpeed);
				}
			

			if ( this.moveBackward && (intersects4.length == 0 && intersects5.length == 0 && intersects6.length == 0) ) {
				this.object.translateZ( actualMoveSpeed );
				
			}

			if ( this.moveLeft && intersects8.length == 0 ) {
				this.object.translateX( - actualMoveSpeed );
				
			}
			if ( this.moveRight && intersects7.length == 0) {
				this.object.translateX( actualMoveSpeed );
				
			}
	
			var actualLookSpeed = delta * this.lookSpeed;

			if ( !this.activeLook ) {

				actualLookSpeed = 0;

			}

			
		}
		if(mouse.x <= -0.8 || mouse.x>= 0.8){
		this.lon += this.mouseX * actualLookSpeed;
		this.phi = ( 90 - this.lat ) * Math.PI / 180;

		this.theta = this.lon * Math.PI / 180;

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );
	}
	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

};