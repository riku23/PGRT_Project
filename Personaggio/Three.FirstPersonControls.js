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
	this.lookSpeed = 0.005;

	this.noFly = false;
	this.lookVertical = true;
	this.autoForward = false;
	// this.invertVertical = false;

	this.activeLook = true;
	this.clickMove = false;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;

	this.mouseDragOn = false;

	if ( this.domElement === document ) {

		this.viewHalfX = window.innerWidth / 2;
		this.viewHalfY = window.innerHeight / 2;

	} else {

		this.viewHalfX = this.domElement.offsetWidth / 2;
		this.viewHalfY = this.domElement.offsetHeight / 2;
		this.domElement.setAttribute( 'tabindex', -1 );

	}

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.clickMove ) {

			switch ( event.button ) {

				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.clickMove ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

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

			case 32: /*SPACEBAR*/ this.movementSpeed = 5; break;

		}

	};

	this.update = function( delta ) {
		var actualMoveSpeed = 0;
		
		if ( this.freeze ) {
			
			return;
			
		} else {

			if ( this.heightSpeed ) {

				var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
				var heightDelta = y - this.heightMin;

				this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

			} else {

				this.autoSpeedFactor = 0.0;

			}
				//RAYCASTER FRONT 1
				var vector1 = new THREE.Vector3(-.5,0,-1);
				var vecrot1 = vector1.applyMatrix4( camera.matrix);
				var raycaster1 = new THREE.Raycaster( camera.position, vecrot1.sub( camera.position ).normalize(), 0.5, 1 );
				//RAYCASTER FRONT 2
				var vector2 = new THREE.Vector3(.5,0,-1);
				var vecrot2 = vector2.applyMatrix4( camera.matrix);
				var raycaster2 = new THREE.Raycaster( camera.position, vecrot2.sub( camera.position ).normalize(), 0.5, 1 );
				//RAYCASTER BACK 1
				var vector3 = new THREE.Vector3(-.5,0,2);
				var vecrot3 = vector3.applyMatrix4( camera.matrix.makeRotationX(Math.PI));
				var raycaster3 = new THREE.Raycaster( camera.position, vecrot3.sub( camera.position ).normalize(), 0.5, 1 );
				//RAYCASTER BACK 2
				var vector4 = new THREE.Vector3(.5,0,2);
				var vecrot4 = vector4.applyMatrix4( camera.matrix.makeRotationX(Math.PI));
				var raycaster4 = new THREE.Raycaster( camera.position, vecrot4.sub( camera.position ).normalize(), 0.5, 1 );
				//RAYCASTER RIGHT
				//var vector5 = new THREE.Vector3(-1,0,1);
				//var vecrot5 = vector5.applyMatrix4( camera.matrix.makeRotationX(90));
				//var raycaster5 = new THREE.Raycaster( camera.position, vecrot5.sub( camera.position ).normalize(), 0.5, 1);
				//RAYCASTER LEFT
				//var vector6 = new THREE.Vector3(1,0,1);
				//var vecrot6 = vector6.applyMatrix4( camera.matrix.makeRotationX(-90));
				//var raycaster6 = new THREE.Raycaster( camera.position, vecrot6.sub( camera.position ).normalize(), 0.5, 1 );
				
				
				var intersects1 = raycaster1.intersectObjects( mura );
				var intersects2 = raycaster2.intersectObjects( mura );
				var intersects3 = raycaster3.intersectObjects( mura );
				var intersects4 = raycaster4.intersectObjects( mura );
				//var intersects5 = raycaster5.intersectObjects( mura );
				//var intersects6 = raycaster6.intersectObjects( mura );

			actualMoveSpeed = delta * this.movementSpeed;

			if ( this.moveForward && (intersects1.length == 0 && intersects2.length == 0) ) {
				this.object.translateZ( -actualMoveSpeed);
				}
			
			if ( this.moveBackward && (intersects3.length == 0 && intersects4.length == 0) ) {
				this.object.translateZ( actualMoveSpeed );
				
			}

			if ( this.moveLeft /*&& intersects6.length == 0*/) {
				this.object.translateX( - actualMoveSpeed );
				
			}
			if ( this.moveRight /*&& intersects5.length == 0*/) {
				this.object.translateX( actualMoveSpeed );
				
			}

			if (!this.noFly) {
				if ( this.moveUp ) {
					this.object.translateY( actualMoveSpeed );
					
				}
				if ( this.moveDown ) {
					this.object.translateY( - actualMoveSpeed );

				}
			}

			var actualLookSpeed = delta * this.lookSpeed;

			if ( !this.activeLook ) {

				actualLookSpeed = 0;

			}

			this.lon += this.mouseX * actualLookSpeed;
			if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed; // * this.invertVertical?-1:1;

			this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
			this.phi = ( 90 - this.lat ) * Math.PI / 180;
			this.theta = this.lon * Math.PI / 180;

			var targetPosition = this.target,
				position = this.object.position;

			targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
			targetPosition.y = position.y + 100 * Math.cos( this.phi );
			targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = ( 90 - this.lat ) * Math.PI / 180;

		this.theta = this.lon * Math.PI / 180;

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );

	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

};
