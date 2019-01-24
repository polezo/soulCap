"use strict";

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




     // CREATE A CUBE
   // const cubeGeometry = new THREE.BoxGeometry(1,1,1);
   // const cubeMaterial = new THREE.MeshNormalMaterial();
   // const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
   // threeCube.frustumCulled = false;
 // threeStuffs.faceObject.add(threeCube);
	
	// Create the BufferGeometryLoader for our hat


var clock = new THREE.Clock();

var texture = new THREE.TextureLoader().load('models/mySprites5-min.png');
var annie = new TextureAnimator(texture, 6, 7, 42, 60); // texture, #horiz, #vert, #total, duration.


var geometry = new THREE.PlaneGeometry( 5.7, 5, 5 );
var material = new THREE.MeshBasicMaterial( {map: texture, transparent: true} );
var cube = new THREE.Mesh( geometry, material );
cube.position.set(0.5,0.5,0.15);
cube.scale.multiplyScalar(1.05);
cube.rotation.set(0.08,0,0.08);
threeStuffs.faceObject.add( cube );

//var geometry = new THREE.PlaneGeometry( 5.7, 5, 5 );
//var material = new THREE.MeshBasicMaterial( {map: texture, transparent: true} );
//var cube = new THREE.Mesh( geometry, material );
//cube.position.set(0.5,0.5,-1);
//cube.scale.multiplyScalar(1.05);
//threeStuffs.faceObject.add( cube );

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
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

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
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}	
// Load our cool hat
    loader.load(
        'models/NewHorn.json',
        function (geometry, materials) {
            // we create our Hat mesh
            			const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("models/blackHornTexture.jpg")
				
           });
            const hatMesh = new THREE.Mesh(geometry, mat);
            hatMesh.scale.multiplyScalar(0.04);
            hatMesh.rotation.set(180, 41.5, 320);
            hatMesh.position.set(0.5, 0.82, 0.82);
            hatMesh.frustumCulled = false;
            hatMesh.side = THREE.DoubleSide;
			
			
			hatMesh.uvsNeedUpdate = true;
			
            threeStuffs.faceObject.add(hatMesh);
        }
    )
	
	  loader.load(
        'models/NewHorn.json',
        function (geometry, materials) {
            // we create our Hat mesh
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("models/blackHornTexture.jpg")
           });
            const hatMesh = new THREE.Mesh(geometry, mat);

            hatMesh.scale.multiplyScalar(0.04);
            hatMesh.rotation.set(180.1, 46.3, 320.5);
            hatMesh.position.set(-0.30, 0.90, 0.82);
            hatMesh.frustumCulled = false;
            hatMesh.side = THREE.DoubleSide;

            threeStuffs.faceObject.add(hatMesh);
        }
    )
    //CREATE THE CAMERA
    const aspecRatio=spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA=new THREE.PerspectiveCamera(20, aspecRatio, 0.1, 100);
} // end init_threeScene()

//launched by body.onload() :
function main(){
    JeelizResizer.size_canvas({
        canvasId: 'jeeFaceFilterCanvas',
        callback: function(isError, bestVideoSettings){
            init_faceFilter(bestVideoSettings);
        }
    })
} //end main()

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
} // end main()

