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
	
	

	let HATOBJ3D = new THREE.Object3D();
   // Create the JSONLoader for our hat
    const loader = new THREE.BufferGeometryLoader();


  // CREATE THE MASK
            const maskLoader = new THREE.BufferGeometryLoader();
            /*
            faceLowPolyEyesEarsFill.json has been exported from dev/faceLowPolyEyesEarsFill.blend using THREE.JS blender exporter with Blender v2.76
            */
            maskLoader.load('./models/mask/faceLowPolyEyesEarsFill2.json', function (maskBufferGeometry) {
                const vertexShaderSource = 'varying vec2 vUVvideo;\n\
                varying float vY, vNormalDotZ;\n\
                const float THETAHEAD=0.25;\n\
                void main() {\n\
                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0);\n\
                    vec4 projectedPosition=projectionMatrix * mvPosition;\n\
                    gl_Position=projectedPosition;\n\
                    \n\
                    //compute UV coordinates on the video texture :\n\
                    vec4 mvPosition0 = modelViewMatrix * vec4( position, 1.0 );\n\
                    vec4 projectedPosition0=projectionMatrix * mvPosition0;\n\
                    vUVvideo=vec2(0.5,0.5)+0.5*projectedPosition0.xy/projectedPosition0.w;\n\
                    vY=position.y*cos(THETAHEAD)-position.z*sin(THETAHEAD);\n\
                    vec3 normalView=vec3(modelViewMatrix * vec4(normal,0.));\n\
                    vNormalDotZ=pow(abs(normalView.z), 1.5);\n\
                }';

               const fragmentShaderSource = "precision lowp float;\n\
                uniform sampler2D samplerVideo;\n\
                varying vec2 vUVvideo;\n\
                varying float vY, vNormalDotZ;\n\
                void main() {\n\
                    vec3 videoColor=texture2D(samplerVideo, vUVvideo).rgb;\n\
                    float darkenCoeff=smoothstep(-0.8, 0.8, vY);\n\
                    float borderCoeff=smoothstep(0.0, 1.0, vNormalDotZ);\n\
                    gl_FragColor=vec4(videoColor*(1.-darkenCoeff), borderCoeff );\n\
                    // gl_FragColor=vec4(borderCoeff, 0., 0., 1.);\n\
                    // gl_FragColor=vec4(darkenCoeff, 0., 0., 1.);\n\
                }";

                const mat = new THREE.ShaderMaterial({
                    vertexShader: vertexShaderSource,
                    fragmentShader: fragmentShaderSource,
                    transparent: true,
                    flatShading: false,
                    uniforms: {
                        samplerVideo:{ value: THREE.JeelizHelper.get_threeVideoTexture() }
                    },
                    transparent: true
                });
                maskBufferGeometry.computeVertexNormals();
                const FACEMESH = new THREE.Mesh(maskBufferGeometry, mat);
                FACEMESH.frustumCulled = false;
                FACEMESH.scale.multiplyScalar(1.22);
                FACEMESH.position.set(0, 0.2, -.8);
                FACEMESH.rotation.set(-.22, 0, 0);
				
               // HATOBJ3D.add(plane);
				HATOBJ3D.add(FACEMESH);
                addDragEventListener(HATOBJ3D);
				
                threeStuffs.faceObject.add(HATOBJ3D);
				
			
				            });
   
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

//var hex = 0x000000;
var planeGeometry = new THREE.PlaneGeometry( 50, 50, 1 );
var planeMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.set(.1,.8,-1.8);
plane.rotation.set(.4,0,0);
threeStuffs.faceObject.add(plane);



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

				fireCylinder.scale.multiplyScalar(2.0);
				fireCylinder.rotation.set(0.03,0,0.08);
				fireCylinder.position.set(.05,.5,-1.59);
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
