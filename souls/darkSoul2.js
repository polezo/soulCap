"use strict";

// SETTINGS of this demo :
const SETTINGS = {
    cameraFOV: 40,      // in degrees, 3D camera FOV
    pivotOffsetYZ: [-0.2, -0.5], // XYZ of the distance between the center of the cube and the pivot
};



let THREECAMERA;


// callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(faceIndex, isDetected) {
    if (isDetected) {
        console.log('INFO in detect_callback() : DETECTED');
    } else {
        console.log('INFO in detect_callback() : LOST');
    }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
	

    const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);
	
	

	
   // Create the JSONLoader for our hat
    const loader = new THREE.BufferGeometryLoader();


  


// Load our cool hat
    loader.load(
        'models/NewHorn.json',
        function (horn, materials) {
            // we create our Hat mesh
            			const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("models/blackHornTexture.jpg")
				
           });
            const hatMesh1 = new THREE.Mesh(horn, mat);
            hatMesh1.scale.multiplyScalar(0.04);
            hatMesh1.rotation.set(180, 41.5, 320);
            hatMesh1.position.set(0.5, 0.82, 0.82);
            hatMesh1.frustumCulled = false;
            hatMesh1.side = THREE.DoubleSide;
			
			
			hatMesh1.uvsNeedUpdate = true;
			
            threeStuffs.faceObject.add(hatMesh1);
        }
    )
	
	  loader.load(
        'models/NewHorn.json',
        function (horn2, materials) {
            // we create our Hat mesh
            const mat2 = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("models/blackHornTexture.jpg")
           });
            const hatMesh = new THREE.Mesh(horn2, mat2);

            hatMesh.scale.multiplyScalar(0.04);
            hatMesh.rotation.set(180.1, 46.3, 320.5);
            hatMesh.position.set(-0.30, 0.90, 0.82);
            hatMesh.frustumCulled = false;
            hatMesh.side = THREE.DoubleSide;

            threeStuffs.faceObject.add(hatMesh);
		
	




			

      }  )
			
		
	var clock = new THREE.Clock();

var fire = new THREE.TextureLoader().load('models/mySprites5-min.png');
var annie = new TextureAnimator(fire, 6, 7, 42, 60); // texture, #horiz, #vert, #total, duration.

	
	var fireGeometry = new THREE.CylinderGeometry(1.06,1.02, 2.4, 38, 2, true, 4.8, 3.4);
				var fireMaterial = new THREE.MeshBasicMaterial( {map: fire, transparent: true} );
				var fireCylinder = new THREE.Mesh( fireGeometry, fireMaterial );

				fireCylinder.scale.multiplyScalar(1.8);
				fireCylinder.rotation.set(0.03,0,0.08);
				fireCylinder.position.set(.05,.5,-1.7);
				fireCylinder.renderOrder = 999;
				threeStuffs.faceObject.add (fireCylinder);
	
	

var animate = function () {
	requestAnimationFrame( animate );
	var delta = clock.getDelta(); 

	annie.update(delta * 1000);

	
};

animate();


function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
{	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	fire.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	fire.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;
		
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
			var currentColumn = this.currentTile % this.tilesHorizontal;
			fire.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			fire.offset.y = currentRow / this.tilesVertical;
		}
	};



	
    //CREATE THE CAMERA
    const aspecRatio=spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA=new THREE.PerspectiveCamera(20, aspecRatio, 0.1, 100);
}}// end init_threeScene()

//launched by body.onload() :
function main(){
    JeelizResizer.size_canvas({
        canvasId: 'jeeFaceFilterCanvas',
        callback: function(isError, bestVideoSettings){
            init_faceFilter(bestVideoSettings);
        }
    })
//end main()

function init_faceFilter(videoSettings){
    JEEFACEFILTERAPI.init({
        followZRot: true,
        canvasId: 'jeeFaceFilterCanvas',
        NNCpath: '../../../dist/', // root of NNC.json file
        maxFacesDetected: 1,
        callbackReady: function(errCode, spec){
          if (errCode){
            console.log('AN ERROR HAPPENS. ERR =', errCode);
            return;
          }

          console.log('INFO : JEEFACEFILTERAPI IS READY');
          init_threeScene(spec);
        }, //end callbackReady()

        //called at each render iteration (drawing loop) :
        callbackTrack: function(detectState){
          THREE.JeelizHelper.render(detectState, THREECAMERA);
        } //end callbackTrack()
    }); //end JEEFACEFILTERAPI.init call
}} // end main()

function soul_img(el) {
  var image = jeeFaceFilterCanvas.toDataURL("image/png");
     el.href = image;
}