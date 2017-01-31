
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

var levelOfDetail = 50;
var feathers = new THREE.Object3D();

var guiParameters = {
    windStrength: 3.0, //0 to 10
    windDirectionX: 0.0, //0 to 1
    windDirectionY: 0.0, //0 to 1
    windDirectionZ: 1.0, //0 to 1
    curvature: 0.0, //increase curvature of spline 1 to 10
    Layer1ColorR: 0.0902,
    Layer1ColorG: 0.1961,
    Layer1ColorB: 0.5411,
    Layer2ColorR: 0.3,
    Layer2ColorG: 0.7,
    Layer2ColorB: 0.3,
    Layer3ColorR: 0.7,
    Layer3ColorG: 0.3,
    Layer3ColorB: 0.3,
    featherDistribution: 0.0, //clumping factor from 0 to 1
    featherSize: 1.0, //
    featherOrientation: 1.0, //increase curvature of individual feathers 1 to 10
    flappingSpeed: 1.0, //0 to 10
    flappingMotion: 0.0 //change orientation of entire wing 0 to 1
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
   var splineObject = new THREE.Line( splineGeom, material );
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
    gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });
    gui.add(guiParameters, 'windStrength', 0, 10).onChange(function(newVal)
    {
      guiParameters.windStrength = newVal;
    });
    gui.add(guiParameters, 'windDirectionX', 0, 1).onChange(function(newVal)
    {
      guiParameters.windDirectionX = newVal;
    });
    gui.add(guiParameters, 'windDirectionY', 0, 1).onChange(function(newVal)
    {
      guiParameters.windDirectionY = newVal;
    });
    gui.add(guiParameters, 'windDirectionZ', 0, 1).onChange(function(newVal)
    {
      guiParameters.windDirectionZ = newVal;
    });
    gui.add(guiParameters, 'curvature', 1, 10).onChange(function(newVal)
    {
      guiParameters.curvature = newVal;
    });
    gui.add(guiParameters, 'Layer1ColorR', 0, 1).onChange(function(newVal)
    {
      guiParameters.Layer1ColorR = newVal;
    });
    gui.add(guiParameters, 'Layer1ColorG', 0, 1).onChange(function(newVal)
    {
      guiParameters.Layer1ColorG = newVal;
    });
    gui.add(guiParameters, 'Layer1ColorB', 0, 1).onChange(function(newVal)
    {
      guiParameters.Layer1ColorB = newVal;
    });
    gui.add(guiParameters, 'featherDistribution', 0, 1).onChange(function(newVal)
    {
      guiParameters.featherDistribution = newVal;
    });
    gui.add(guiParameters, 'featherSize', 0, 1).onChange(function(newVal)
    {
      guiParameters.featherSize = newVal;
    });
    gui.add(guiParameters, 'featherOrientation', 0, 1).onChange(function(newVal)
    {
      guiParameters.featherOrientation = newVal;
    });
    gui.add(guiParameters, 'flappingSpeed', 0, 1).onChange(function(newVal)
    {
      guiParameters.flappingSpeed = newVal;
    });
    gui.add(guiParameters, 'flappingMotion', 0, 1).onChange(function(newVal)
    {
      guiParameters.flappingMotion = newVal;
    });
}

// function noisehash(var t)
// {
//   t  = fract( t*0.3183099+0.1 ) * 17.0;
//   return fract( t );
// }

// called on frame updates
function onUpdate(framework)
{
    var date = new Date();
    feathers.rotateY(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);
    for(var i=0; i<levelOfDetail; i++)
    {
      feathers.children[i].rotateX((Math.sin(date.getTime() / 100) * 2 * Math.PI / 180) *
                                   (guiParameters.windDirectionX * guiParameters.windStrength));
      feathers.children[i].rotateY((Math.sin(date.getTime() / 100) * 2 * Math.PI / 180) *
                                   (guiParameters.windDirectionY * guiParameters.windStrength));
      feathers.children[i].rotateZ((Math.sin(date.getTime() / 100) * 2 * Math.PI / 180) *
                                   (guiParameters.windDirectionZ * guiParameters.windStrength));
    }

    feather_Material.uniforms.feathercolor.value = new THREE.Vector3( guiParameters.Layer1ColorR,
                                                                      guiParameters.Layer1ColorG,
                                                                      guiParameters.Layer1ColorB );
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
