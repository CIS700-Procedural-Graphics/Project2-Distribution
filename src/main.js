
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Wing from './wing'

var feathers = [];
var wingParams = {
    'Curvature': 0.2,
    'Feather distr': 1,
    'Feather size': 0.8,
    'Feather orient': 0.8,
    'Feather color': 0,
    'Flapping speed': 1,
    'Flapping motion': 2,
};

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

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    objLoader.load('geo/feather.obj', function(obj) {

        // LOOK: This function runs after the obj has finished loading
        var featherGeo = obj.children[0].geometry;

        // var featherMesh = new THREE.Mesh(featherGeo, lambertWhite);
        // featherMesh.name = "feather";
        // scene.add(featherMesh);

        for(var i = 1; i < 50; i++) {
            var material = lambertWhite.clone();
            var fMesh = new THREE.Mesh(featherGeo, material);

            var posZ = Wing.wingCurve(i / 50, wingParams['Curvature']);
            var posX = Wing.featherSpread(i / 50);
            fMesh.position.setX(i / 10);//posX);
            fMesh.position.setZ((posZ - 0.5) * 10);
            feathers.push(fMesh);
        
            var rot = Wing.featherRotation(i / 50, wingParams['Feather orient']);
            fMesh.rotation.y = Math.PI / 3;
            fMesh.rotation.y -= rot * 1.8;

            var scale = 2 - Wing.featherSize(i / 50, wingParams['Feather size']);
            fMesh.scale.set(scale, scale, scale);

            var color = Wing.featherColor(i / 50, wingParams['Feather color']);
            fMesh.material.color = new THREE.Color(color[0], color[1], color[2]);
        
            scene.add(fMesh);
        }
    });

    // set camera position
    camera.position.set(5, 10, -5);
    camera.lookAt(new THREE.Vector3(0,-10,0));

    scene.add(directionalLight);

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
    gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });

    gui.add(wingParams, 'Curvature', 0, 1).onChange(function (value) {
        for (var i = 0; i < feathers.length; i++) {
            var posZ = Wing.wingCurve(i / 50, value);
            feathers[i].position.setZ((posZ - 0.5) * 10);
        }
    });

    gui.add(wingParams, 'Feather distr', 0, 1).onChange(function(value) {
        for (var i = 0; i < feathers.length; i++) {
            feathers[i].position.setX(i / (10 * value));
        }
    });

    gui.add(wingParams, 'Feather size', 0, 1).onChange(function(value) {
        for (var i = 0; i < feathers.length; i++) {
             var scale = 2 - Wing.featherSize(i / 50, 1-value);
             feathers[i].scale.set(scale, scale, scale);
        }
    });

    gui.add(wingParams, 'Feather orient', 0, 1).onChange(function(value) {
        for (var i = 0; i < feathers.length; i++) {
             var rot = Wing.featherRotation(i / 50, value);
            feathers[i].rotation.y = Math.PI / 3;//(30 * rot) ;
            feathers[i].rotation.y -= rot * 1.8;
        }
    });
     gui.add(wingParams, 'Feather color', -50, 50).onChange(function(value) {
        for (var i = 0; i < feathers.length; i++) {
            var color = Wing.featherColor(i / 50, value);
            feathers[i].material.color = new THREE.Color(color[0], color[1], color[2]);
        }
    });

    gui.add(wingParams,'Flapping speed', 0, 2);
    gui.add(wingParams, 'Flapping motion', 0, 10);
}



// called on frame updates
function onUpdate(framework) {
    var feather = framework.scene.getObjectByName("feather"); 
    for (var i = 0; i < feathers.length; i++) {
        feather = feathers[i];    
           
        if (feather !== undefined) {
            // Simply flap wing
            var date = new Date();

            var jitter = Wing.windJitter(feather.position.x + date.getMilliseconds(), feather.position.z + date.getMilliseconds());
            feather.rotateZ(Math.sin(date.getTime() /100 * wingParams['Flapping speed']+ jitter/10 ) * wingParams['Flapping motion'] * Math.PI / 180);


        }
    }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);