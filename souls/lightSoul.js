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
	THREETORUS.position.set(0, 1.8, -.45);
	THREETORUS.frustumCulled = false;
            THREETORUS.side = THREE.DoubleSide;

const loader = new THREE.BufferGeometryLoader();


  // CREATE THE MASK
            const maskLoader = new THREE.BufferGeometryLoader();
            /*
            faceLowPolyEyesEarsFill.json has been exported from dev/faceLowPolyEyesEarsFill.blend using THREE.JS blender exporter with Blender v2.76
            */
            maskLoader.load('./models/mask/faceLowPolyEyesEarsFill.json', function (maskBufferGeometry) {
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
                    float darkenCoeff=smoothstep(1.0, 1.0, vY);\n\
                    float borderCoeff=smoothstep(0.0, 0.8, vNormalDotZ);\n\
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
                FACEMESH.scale.multiplyScalar(1.33);
                FACEMESH.position.set(0, 0.3, -.8);
                FACEMESH.rotation.set(-.22, 0, 0);
				
                HATOBJ3D.add(FACEMESH);
				//HATOBJ3D.add(THREETORUS);
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

    //MT216 : create the frame. We reuse the geometry of the video
    const frameMesh=new THREE.Mesh(threeStuffs.videoMesh.geometry,  create_mat2d(new THREE.TextureLoader().load('models/rays.png'), true))
    frameMesh.renderOrder = 999; // render last
    frameMesh.frustumCulled = false;
    threeStuffs.scene.add(frameMesh);

   
 
     
 
    // CREATE A LIGHT
   // const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    //hreeStuffs.scene.add(ambient);
 

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
