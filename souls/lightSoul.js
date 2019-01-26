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