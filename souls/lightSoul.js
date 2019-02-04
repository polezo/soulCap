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
 
 var clock = new THREE.Clock();

var texture = new THREE.TextureLoader().load('models/liteRays-min.png');
var annie = new TextureAnimator(texture, 6, 4, 24, 60); // texture, #horiz, #vert, #total, duration.


var geometry = new THREE.CylinderGeometry(3,3, 3, 38, 2, true, 4.8, 3.4);
var material = new THREE.MeshBasicMaterial( {map: texture, transparent: true} );
var cube = new THREE.Mesh( geometry, material );
cube.position.set(0,.5,-3);
cube.scale.multiplyScalar(1.5);
cube.rotation.set(0,0,0);
cube.renderOrder=1000;
cube.frustumCulled=false;
threeStuffs.faceObject.add( cube );

    // CREATE THE VIDEO BACKGROUND
    function create_mat2d(threeTexture, isTransparent){ //MT216 : we put the creation of the video material in a func because we will also use it for the frame
        return new THREE.RawShaderMaterial({
            depthWrite: false,
            depthTest: false,
            transparent: isTransparent,
            vertexShader: "attribute vec2 position;\n\
                varying vec2 vUV;\n\
                void main(void){\n\
                    gl_Position=vec4(position, 0., 1.);\n\
                    vUV=0.5+0.5*position;\n\
                }",
            fragmentShader: "precision lowp float;\n\
                uniform sampler2D samplerVideo;\n\
                varying vec2 vUV;\n\
                void main(void){\n\
                    gl_FragColor=texture2D(samplerVideo, vUV);\n\
                }",
             uniforms:{
                samplerVideo: { value: threeTexture }
             }
        });
    }

    //MT216 : create the frame. We reuse the geometry of the video
    const frameMesh=new THREE.Mesh(threeStuffs.videoMesh.geometry,  create_mat2d(new THREE.TextureLoader().load('models/liteRays-min.png'), true))
    frameMesh.renderOrder = 999; // render last
    frameMesh.frustumCulled = false;
    threeStuffs.scene.add(frameMesh);

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
  
  let HATOBJ3D = new THREE.Object3D();
  
 
     // CREATE A torus
    const torusGeometry = new THREE.TorusBufferGeometry(1,.1,16,60);
    const torusMat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("models/goldFoilTexture.jpg")
           });
		   
    const THREETORUS = new THREE.Mesh(torusGeometry, torusMat);
     threeStuffs.faceObject.add(THREETORUS);
	 THREETORUS.rotation.set(1.4, 0, 0);
	THREETORUS.position.set(0, 2, -.45);
	THREETORUS.frustumCulled = false;
            THREETORUS.side = THREE.DoubleSide;


 
    // CREATE A LIGHT
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    threeStuffs.scene.add(ambient);
 

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

function soul_img(el) {
  var image = jeeFaceFilterCanvas.toDataURL("image/png");
     el.href = image;
}
