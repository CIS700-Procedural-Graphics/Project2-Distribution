
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

//var levelOfDetail = 50;
var feathers = new THREE.Object3D();
var splineObject = new THREE.Line();
var curve = new THREE.SplineCurve( [
     new THREE.Vector2( 1, 0 ),
     new THREE.Vector2( -0.5, -0.6 ),
     new THREE.Vector2( -2, 0 ),
     new THREE.Vector2( -2.5, 0 )
   ] );
var PathLayer1 = new THREE.Path(curve.getPoints(50)); //50 is the numberOfFeathers initially
var splineGeom = PathLayer1.createPointsGeometry(50);
var featherMesh = new THREE.Mesh();
var featherGeo = new THREE.Geometry();
var oldNum = 50;

var guiParameters = {
    windStrength: 3.0, //0 to 10
    windDirectionX: 0.1, //0 to 1
    windDirectionY: 0.1, //0 to 1
    windDirectionZ: 0.1, //0 to 1
    controlPoint2x: 0.1, //increase curvature of spline
    controlPoint2y: 0.1, //increase curvature of spline
    controlPoint3x: 0.1, //increase curvature of spline
    controlPoint3y: 0.1, //increase curvature of spline
    Layer1ColorR: 0.0902,
    Layer1ColorG: 0.1961,
    Layer1ColorB: 0.5411,
    Layer2ColorR: 0.8471,
    Layer2ColorG: 0.1647,
    Layer2ColorB: 0.1647,
    Layer3ColorR: 0.0667,
    Layer3ColorG: 0.749,
    Layer3ColorB: 0.2039,
    numberOfFeathers: 50,
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

function createFeathers(scene)
{
  //remove from scene
  for(var i=0; i<oldNum ;i++)
  {
    if(feathers.children[i])
    {
      scene.remove(feathers.children[i]);
      feathers.remove(feathers.children[i]);
    }
  }

  //add to feathers group
  for(var i=0; i<guiParameters.numberOfFeathers ;i++)
  {
    featherMesh = new THREE.Mesh(featherGeo, feather_Material);
    var position = splineGeom.vertices[i];
    featherMesh.position.set(position.x, position.y, 0);
    featherMesh.scale.set(0.3, 0.3, 0.3);
    var radianY = -90 * (Math.PI/180);
    var radianZ = -90 * (Math.PI/180);
    featherMesh.rotateY( radianY );
    featherMesh.rotateZ( radianZ );
    feathers.add(featherMesh);
  }
  scene.add(feathers);
  oldNum = guiParameters.numberOfFeathers;
}

function changeGUI(framework)
{
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  var f1 = gui.addFolder('Colors');
  var f7 = f1.addFolder('Layer1');
  var f8 = f1.addFolder('Layer2');
  var f9 = f1.addFolder('Layer3');
  f7.add(guiParameters, 'Layer1ColorR', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.Layer1ColorR = newVal;
  });
  f7.add(guiParameters, 'Layer1ColorG', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.Layer1ColorG = newVal;
  });
  f7.add(guiParameters, 'Layer1ColorB', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.Layer1ColorB = newVal;
  });

  f8.add(guiParameters, 'Layer2ColorR', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.Layer2ColorR = newVal;
  });
  f8.add(guiParameters, 'Layer2ColorG', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.Layer2ColorG = newVal;
  });
  f8.add(guiParameters, 'Layer2ColorB', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.Layer2ColorB = newVal;
  });

  f9.add(guiParameters, 'Layer3ColorR', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.Layer3ColorR = newVal;
  });
  f9.add(guiParameters, 'Layer3ColorG', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.Layer3ColorG = newVal;
  });
  f9.add(guiParameters, 'Layer3ColorB', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.Layer3ColorB = newVal;
  });

  var f2 = gui.addFolder('Feathers');
  f2.add(guiParameters, 'featherDistribution', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.featherDistribution = newVal;

  });
  f2.add(guiParameters, 'featherSize', 0.3, 2.0).onChange(function(newVal)
  {
    guiParameters.featherSize = newVal;
    featherSizeChanged();
  });
  f2.add(guiParameters, 'featherOrientation', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.featherOrientation = newVal;
  });
  f2.add(guiParameters, 'numberOfFeathers', 30, 200).onChange(function(newVal)
  {
    guiParameters.numberofFeathers = newVal;
    changeSpline()
    createFeathers(scene)
  });

  var f3 = gui.addFolder('Flapping');
  f3.add(guiParameters, 'flappingSpeed', 0.0, 5.0).onChange(function(newVal)
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
    windChanged();
  });
  f4.add(guiParameters, 'windDirectionX', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.windDirectionX = newVal;
    windChanged();
  });
  f4.add(guiParameters, 'windDirectionY', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.windDirectionY = newVal;
    windChanged();
  });
  f4.add(guiParameters, 'windDirectionZ', 0.0, 1.0).onChange(function(newVal)
  {
    guiParameters.windDirectionZ = newVal;
    windChanged();
  });

  var f5 = gui.addFolder('Camera');
  f5.add(camera, 'fov', 0.0, 180.0).onChange(function(newVal) {
      camera.updateProjectionMatrix();
  });

  var f6 = gui.addFolder('Wing Shape');
  f6.add(guiParameters, 'controlPoint2x', -1.0, 1.0).onChange(function(newVal)
  {
    guiParameters.controlPoint2x = newVal;
    changeSpline()
    createFeathers(scene)
  });
  f6.add(guiParameters, 'controlPoint2y', -1.0, 1.0).onChange(function(newVal)
  {
    guiParameters.controlPoint2y = newVal;
    changeSpline()
    createFeathers(scene)
  });
  f6.add(guiParameters, 'controlPoint3x', -1.0, 1.0).onChange(function(newVal)
  {
    guiParameters.controlPoint3x = newVal;
    changeSpline()
    createFeathers(scene)
  });
  f6.add(guiParameters, 'controlPoint3y', -1.0, 1.0).onChange(function(newVal)
  {
    guiParameters.controlPoint3y = newVal;
    changeSpline()
    createFeathers(scene)
  });
}

function setupLightsandSkybox(framework)
{
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

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

  // set camera position
  camera.position.set(0, 1, 5);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // scene.add(lambertCube);
  scene.add(directionalLight);
}

function changeSpline()
{
    curve = new THREE.SplineCurve( [
               new THREE.Vector2( 1, 0 ),
               new THREE.Vector2( -0.5 + guiParameters.controlPoint2x, -0.6  + guiParameters.controlPoint2y),
               new THREE.Vector2( -2 + guiParameters.controlPoint3x, 0 + guiParameters.controlPoint3y),
               new THREE.Vector2( -2.5, 0 )
             ] );
    PathLayer1 = new THREE.Path( curve.getPoints( guiParameters.numberOfFeathers ) );
    splineGeom = PathLayer1.createPointsGeometry(guiParameters.numberOfFeathers);

  if(feathers.children[i])
  {
    for(var i=0; i<guiParameters.numberOfFeathers ;i++)
    {
      var position = splineGeom.vertices[i];
      feathers.children[i].position.set(position.x, position.y, 0);
    }
  }
}

function windChanged()
{
  var date = new Date();
  for(var i=0; i<guiParameters.numberOfFeathers; i++)
  {
    if(feathers.children[i])
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
}

function featherSizeChanged()
{
  if(feathers.children[i])
  {
    for(var i=0; i<guiParameters.numberOfFeathers ;i++)
    {
      feathers.children[i].scale.set(guiParameters.featherSize, guiParameters.featherSize, guiParameters.featherSize);
    }
  }
}

// called after the scene loads
function onLoad(framework)
{
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    setupLightsandSkybox(framework);

   var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
   splineObject = new THREE.Line( splineGeom, material );
   scene.add(splineObject);

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    objLoader.load('geo/feather.obj', function(obj)
    {
        // LOOK: This function runs after the obj has finished loading
        featherGeo = obj.children[0].geometry;
        for(var i=0; i<guiParameters.numberOfFeathers ;i++)
        {
          featherMesh = new THREE.Mesh(featherGeo, feather_Material);
          featherMesh.name = "feather";
          var position = splineGeom.vertices[i];
          featherMesh.position.set(position.x, position.y, 0);
          featherMesh.scale.set(0.3, 0.3, 0.3);
          var radianY = -90 * (Math.PI/180);
          var radianZ = -90 * (Math.PI/180);
          featherMesh.rotateY( radianY );
          featherMesh.rotateZ( radianZ );
          feathers.add(featherMesh);
          // scene.add(featherMesh);
        }
    });

    for(var i=0; i<guiParameters.numberOfFeathers; i++)
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
    changeGUI(framework);
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
  windChanged();
  // changeSpline();

  var y_rotation = Math.sin(date.getTime() / 100) * 2 * Math.PI / 180;
  splineObject.rotateY(guiParameters.flappingSpeed * y_rotation);
  feathers.rotateY(guiParameters.flappingSpeed * y_rotation);

  feather_Material.uniforms.feathercolor.value = new THREE.Vector3( guiParameters.Layer1ColorR,
                                                                    guiParameters.Layer1ColorG,
                                                                    guiParameters.Layer1ColorB );
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
