
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import {layer1, layer2, layer3, layer4} from './toolbox_functions'

var numFeathers; //set after loading in the feather obj during the callback function

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Basic Lambert white
    var physGold = new THREE.MeshPhysicalMaterial({ color: 0xFFD700, side: THREE.DoubleSide });
    var physGreen = new THREE.MeshPhysicalMaterial({ color: 0xDDFF00, side: THREE.DoubleSide });
    var physBlue = new THREE.MeshPhysicalMaterial({ color: 0x0063Af, side: THREE.DoubleSide });
    var physRed = new THREE.MeshPhysicalMaterial({ color: 0xDD0000, side: THREE.DoubleSide });

    // Set light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.position.set(1, 3, 2);
    directionalLight.position.multiplyScalar(10);

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = '/images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;
    
    //Add multiple copies of the feather mesh into the scene upon loading the obj
    //https://github.com/mrdoob/three.js/blob/master/examples/webgl_performance.html#L56
    
    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    objLoader.load('/geo/feather.obj', function(obj) {

        // LOOK: This function runs after the obj has finished loading
        var featherGeo = obj.children[0].geometry;
        
        //Choose how densely populated the first layer should be
        var layer1Num = 52;
        
        //Create the first layer of feathers(along the arm)
        for(var i = 0; i < layer1Num; i++) {
        	var featherMesh = new THREE.Mesh(featherGeo, physGold);
        	featherMesh.name = "feather_" + i;
        	layer1(featherMesh, i, layer1Num);
        	scene.add(featherMesh);
   		}
   		
   		//Continue for other layers
   		var layer2Num = 100;
   		
   		for(var j = 0; j < layer2Num; j++) {
   			var featherMesh = new THREE.Mesh(featherGeo, physGreen);
        	featherMesh.name = "feather_" + (j + i);
        	layer2(featherMesh, j, layer2Num);
        	scene.add(featherMesh);
   		}
   		
   		//Continue for other layers
   		var layer3Num = 150;
   		
   		for(var k = 0; k < layer3Num; k++) {
   			var featherMesh = new THREE.Mesh(featherGeo, physBlue);
        	featherMesh.name = "feather_" + (k + j + i);
        	layer3(featherMesh, k, layer3Num);
        	scene.add(featherMesh);
   		}
   		
   		//Continue for other layers
   		var layer4Num = 25;
   		
   		for(var l = 0; l < layer4Num; l++) {
   			var featherMesh = new THREE.Mesh(featherGeo, physRed);
        	featherMesh.name = "feather_" + (l + k + j + i);
        	layer4(featherMesh, l, layer4Num);
        	scene.add(featherMesh);
   		}
   		
   		numFeathers = i + j + k + l;
    });
    
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
}

// called on frame updates
function onUpdate(framework) {
	for(var i = 0; i < numFeathers; i++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + i);
		
		//Flap the feather
		if (currentFeather !== undefined) {
        	var date = new Date();
        	//currentFeather.rotateZ(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);
    	}
	}
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);