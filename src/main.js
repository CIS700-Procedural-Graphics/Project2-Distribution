
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

var levelOfDetail = 50;
var feathers = new THREE.Object3D();
var splineObject = new THREE.Line();

var guiParameters = {
    windStrength: 3.0, //0 to 10
    windDirectionX: 0.1, //0 to 1
    windDirectionY: 0.1, //0 to 1
    windDirectionZ: 0.1, //0 to 1
    curvature: 0.1, //increase curvature of spline 1 to 10
    Layer1ColorR: 0.0902,
    Layer1ColorG: 0.1961,
    Layer1ColorB: 0.5411,
    Layer2ColorR: 0.3,
    Layer2ColorG: 0.7,
    Layer2ColorB: 0.3,
    Layer3ColorR: 0.7,
    Layer3ColorG: 0.3,
    Layer3ColorB: 0.3,
    featherDistribution: 1.0, //clumping factor from 0 to 1
    featherSize: 1.0, //
    featherOrientation: 1.0, //increase curvature of individual feathers 1 to 10
    flappingSpeed: 1.0, //0 to 10
    flappingMotion: 1.0 //change orientation of entire wing 0 to 1
}

var feather_Material = new THREE.ShaderMaterial({
  uniforms:
  {
    feathercolor:
    {
        type: "v3",
        value: new THREE.Vector3( 0.0902, 0.1961, 0.5411 )
    }
  },
  vertexShader: require('./shaders/feather-vert.glsl'),
  fragmentShader: require('./shaders/feather-frag.glsl')
});

function dynamicLayers()
{
}

var featherOriginalX = [];
var featherOriginalY = [];
var featherOriginalZ = [];

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Basic Lambert white
    var lambertWhite = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    var lambertBlue = new THREE.MeshLambertMaterial({ color: 0x17328A, side: THREE.DoubleSide });

    // Set light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.position.set(1, 3, 2);
    directionalLight.position.multiplyScalar(10);

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = 'images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;

    //create spline for wing shape
    var curve = new THREE.SplineCurve( [
	       new THREE.Vector2( 1, 0 ),
	       new THREE.Vector2( -0.5, -0.6 ),
	       new THREE.Vector2( -2, 0 ),
	       new THREE.Vector2( -2.5, 0 )
       ] );

   var PathLayer1 = new THREE.Path( curve.getPoints( levelOfDetail ) );

   var splineGeom = PathLayer1.createPointsGeometry( levelOfDetail );
   var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

   // Create the final object to add to the scene
   splineObject = new THREE.Line( splineGeom, material );
   scene.add(splineObject);

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    var featherGeo = new THREE.Geometry();

    objLoader.load('geo/feather.obj', function(obj)
    {
        // LOOK: This function runs after the obj has finished loading
        featherGeo = obj.children[0].geometry;
        for(var i=0; i<levelOfDetail ;i++)
        {
          //var featherMesh = new THREE.Mesh(featherGeo, lambertBlue);
          var featherMesh = new THREE.Mesh(featherGeo, feather_Material);
          featherMesh.name = "feather";
          var position = splineGeom.vertices[i];
          featherMesh.position.set(position.x, position.y, 0);
          featherMesh.scale.set(0.6, 0.6, 0.6);
          var radianY = -90 * (Math.PI/180);
          var radianZ = -90 * (Math.PI/180);
          featherMesh.rotateY( radianY );
          featherMesh.rotateZ( radianZ );
          feathers.add(featherMesh);
          // scene.add(featherMesh);
        }
    });

    for(var i=0; i<levelOfDetail; i++)
    {
      featherOriginalX.push(0);
      featherOriginalY.push(0);
      featherOriginalZ.push(0);
    }

    var radianX = -90 * (Math.PI/180);
    feathers.rotateX( radianX );
    splineObject.rotateX( radianX );
    scene.add(feathers);
    scene.add(splineObject);

    // set camera position
    camera.position.set(0, 1, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // scene.add(lambertCube);
    scene.add(directionalLight);

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
    var f1 = gui.addFolder('Colors');
    f1.add(guiParameters, 'Layer1ColorR', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.Layer1ColorR = newVal;
    });
    f1.add(guiParameters, 'Layer1ColorG', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.Layer1ColorG = newVal;
    });
    f1.add(guiParameters, 'Layer1ColorB', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.Layer1ColorB = newVal;
    });

    var f2 = gui.addFolder('Feathers');
    f2.add(guiParameters, 'featherDistribution', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.featherDistribution = newVal;
    });
    f2.add(guiParameters, 'featherSize', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.featherSize = newVal;
    });
    f2.add(guiParameters, 'featherOrientation', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.featherOrientation = newVal;
    });

    var f3 = gui.addFolder('Flapping');
    f3.add(guiParameters, 'flappingSpeed', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.flappingSpeed = newVal;
    });
    f3.add(guiParameters, 'flappingMotion', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.flappingMotion = newVal;
    });

    var f4 = gui.addFolder('Wind');
    f4.add(guiParameters, 'windStrength', 0.0, 10.0).onChange(function(newVal)
    {
      guiParameters.windStrength = newVal;
    });
    f4.add(guiParameters, 'windDirectionX', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.windDirectionX = newVal;
    });
    f4.add(guiParameters, 'windDirectionY', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.windDirectionY = newVal;
    });
    f4.add(guiParameters, 'windDirectionZ', 0.0, 1.0).onChange(function(newVal)
    {
      guiParameters.windDirectionZ = newVal;
    });

    var f5 = gui.addFolder('Camera');
    f5.add(camera, 'fov', 0.0, 180.0).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });

    var f6 = gui.addFolder('Wing Shape');
    f6.add(guiParameters, 'curvature', 1.0, 10.0).onChange(function(newVal)
    {
      guiParameters.curvature = newVal;
    });
}

function noisehash(x)
{
  // t = t*0.3183099+0.1 * 17.0;
  // t /= 1000.0;
  // return t;

  // x = (x<<13 ^ x);
  // return (1.0 - (x * (x * x * 15731 +)))
}

function noisehash2(x,y)
{
  return (Math.cos(x) + Math.sin(y));
}

// called on frame updates
function onUpdate(framework)
{
  var date = new Date();
  var feather = framework.scene.getObjectByName("feather");
  if (feather !== undefined)
  {
      // Simply flap wing

      //feather.rotateZ(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);
      for(var i=0; i<levelOfDetail; i++)
      {
        //feathers.children[i].rotateZ(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);

        feathers.children[i].rotateX(-featherOriginalX[i]);
        feathers.children[i].rotateY(-featherOriginalY[i]);
        feathers.children[i].rotateZ(-featherOriginalZ[i]);

        var rx = (Math.sin(date.getTime() / 100) * 2 * Math.PI / 180) *
                   (guiParameters.windDirectionX * guiParameters.windStrength)
                    * Math.random();

        var ry =(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180) *
                  (guiParameters.windDirectionY * guiParameters.windStrength)
                  * Math.random();

        var rz=(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180) *
                  (guiParameters.windDirectionZ * guiParameters.windStrength)
                  * Math.random();

        feathers.children[i].rotateX(rx);
        feathers.children[i].rotateY(ry);
        feathers.children[i].rotateZ(rz);

        featherOriginalX[i] = rx;
        featherOriginalY[i] = ry;
        featherOriginalZ[i] = rz;
      }
  }
    var date = new Date();
    splineObject.rotateY(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);
    feathers.rotateY(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);

    feather_Material.uniforms.feathercolor.value = new THREE.Vector3( guiParameters.Layer1ColorR,
                                                                      guiParameters.Layer1ColorG,
                                                                      guiParameters.Layer1ColorB );
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
