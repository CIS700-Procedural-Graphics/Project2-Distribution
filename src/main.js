
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Distribution from './distribution'

//geometry of feather, will be created when obj loaded
var featherGeo;

//curve that defines the shape of the wing, feather positions will start from here
var curve = new THREE.CatmullRomCurve3( [
       new THREE.Vector3( -2.5, -0.5, 1.15 ),
       new THREE.Vector3( -2.25, 0.25, 1.25 ),
       new THREE.Vector3( 0, 0, 0.25 ),
       new THREE.Vector3( 1.5, -0.25, 0 ),
       new THREE.Vector3( 2.5, 0.25, 0 )
] );

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Basic Lambert white
    var lambertWhite = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });

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

    scene.add(directionalLight);

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    objLoader.load('geo/feather.obj', function(obj) {

    // LOOK: This function runs after the obj has finished loading
    featherGeo = obj.children[0].geometry;

    //create 100 feathers, deciding positions, rotations and scales using function from distribution.js
    for(var i = 0.0; i < 100.0; i++)
    {
        var featherColor = new THREE.ShaderMaterial({
            uniforms: {
                layer: { 
                    value: i
                },
                light: {
                    value: directionalLight.position
                },
                colorType: { //will dictate what pallete of colors the wings will be 
                    value: 1
                },
            },
            //using my own shaders to dictate color interpolation, lambert, iridescence
            vertexShader: require('./shaders/feather-vert.glsl'),
            fragmentShader: require('./shaders/feather-frag.glsl')
        });

        //creating a mesh object for this feather
        var featherMesh = new THREE.Mesh(featherGeo, featherColor);
        featherMesh.name = "feather" + i; //used in onUpdate

        //sent into distribution functions to get correct placement, orientation, and scale based on curve and number of feathers
        var params = {
            num: i,
            total1: 45,
            total2: 75,
            total3: 100,
            curve: curve
        };

        Distribution.getPos(featherMesh, params);
        Distribution.getRot(featherMesh, params);
        Distribution.getScale(featherMesh, params);
        scene.add(featherMesh);
    }
});

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
    gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });

    gui.add(Distribution, 'curvature', 0.0, 4.0).onChange(function(newVal) {
        Distribution.updateCurve(newVal);
    });

    gui.add(Distribution, 'featherDistribution', 0.0, 1.0).onChange(function(newVal) {
        Distribution.updateDistrib(newVal);
    });

    gui.add(Distribution, 'featherSize', 0.0, 2.0).onChange(function(newVal) {
        Distribution.updateSize(newVal);
    });

    gui.add(Distribution, 'featherOrientation', -1.0, 1.0).onChange(function(newVal) {
        Distribution.updateOrient(newVal);
    });

    gui.add(Distribution, 'color', 1, 2).onChange(function(newVal) {
        Distribution.changeColor();
        for(var i = 0.0; i < 100.0; i++)
        {
            var f = framework.scene.getObjectByName("feather" + i);
            if(f !== undefined)
            {
                f.material.uniforms["colorType"].value = Distribution.color;
            }         
        }
    });

    gui.add(Distribution, 'windSpeed', 0.0, 1.0).onChange(function(newVal) {
        Distribution.updateSpeed(newVal);
    });

    gui.add(Distribution, 'flapSpeed', 0.0, 5.0).onChange(function(newVal) {
        Distribution.updateFlapSpeed(newVal);
    });

    gui.add(Distribution, 'windDirection', -90.0, 90.0).onChange(function(newVal) {
        Distribution.updateDir(newVal);
    });
}

// called on frame updates
function onUpdate(framework) {
    //increment time and recompute position, orientation, scale based on the new time
    Distribution.incTime();
    for(var i = 0.0; i < 100.0; i++)
    {
        var f = framework.scene.getObjectByName("feather" + i);
        if(f !== undefined)
        {
            var params = {
                num: i,
                total1: 45,
                total2: 75,
                total3: 100,
                curve: curve
            };

            Distribution.getPos(f, params);
            Distribution.getRot(f, params);
            Distribution.getScale(f, params);
        }            
    }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);