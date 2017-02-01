
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import {layer1, layer2, layer3, layer4, updateYPosition, updateZPosition, updateXRotation, updateYRotation, updateZRotation, updateXScale, updateYScale, updateZScale, flapWing, applyWind} from './toolbox_functions'

var featherGroup = new THREE.Object3D();
featherGroup.name = 'feather_group';

var flappingSpeed = { flappingSpeedScale : 1 }; //This goes into the onUpdate function and scale up/down the sin function.

var flappingMotion = { flappingMotionScale : 1 }; //Like above. scales up/down the amplitude of the sin function.

var windIntensity = { wind_intensity : 0.01};

var numFeathers; //set after loading in the feather obj during the callback function

//Choose how densely populated the first layer should be
var layer1Num = 52;
var layer2Num = 100;
var layer3Num = 150;
var layer4Num = 25;

function ApplyWind(framework) {
	applyWind(featherGroup, 0.15);
}

function flapEachFeather(framework, flapScale, flapValue) {
	for(var i = 0; i < layer1Num; i++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + i);
		flapWing(currentFeather, i, layer1Num, flapScale, flapValue);
	}
	
	for(var j = 0; j < layer2Num; j++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + (i + j));
		flapWing(currentFeather, j, layer2Num, flapScale, flapValue);
	}
	
	for(var k = 0; k < layer3Num; k++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + (i + j + k));
		flapWing(currentFeather, k, layer3Num, flapScale, flapValue);
	}
	
	for(var l = 0; l < layer4Num; l++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + (i + j + k + l));
		flapWing(currentFeather, l, layer4Num, flapScale, flapValue);
	}
}

function UpdateXScales(framework, scaleAmount) {
	framework.scene.getObjectByName('feather_group').scale.set(scaleAmount, 1, 1);
}

function UpdateYScales(framework, scaleAmount) {
	framework.scene.getObjectByName('feather_group').scale.set(1, scaleAmount, 1);
}

function UpdateZScales(framework, scaleAmount) {
	framework.scene.getObjectByName('feather_group').scale.set(1, 1, scaleAmount);
}



function updateXRotations(framework, rotAmount) {
	for(var i = 0; i < numFeathers; i++) {
		var currentFeather = framework.scene.getObjectByName('feather_group').children[i];
		updateXRotation(currentFeather, rotAmount);
	}
}

function updateYRotations(framework, rotAmount) {
	for(var i = 0; i < numFeathers; i++) {
		var currentFeather = framework.scene.getObjectByName('feather_group').children[i];
		updateYRotation(currentFeather, rotAmount);
	}
}

function updateZRotations(framework, rotAmount) {
	for(var i = 0; i < numFeathers; i++) {
		var currentFeather = framework.scene.getObjectByName('feather_group').children[i];
		updateZRotation(currentFeather, rotAmount);
	}
}

function updateYPositions(framework, curvatureAmount) {
	for(var i = 0; i < layer1Num; i++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + i);
		updateYPosition(currentFeather, i, layer1Num, curvatureAmount);
	}
	
	for(var j = 0; j < layer2Num; j++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + (i + j));
		updateYPosition(currentFeather, j, layer2Num, curvatureAmount);
	}
	
	for(var k = 0; k < layer3Num; k++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + (i + j + k));
		updateYPosition(currentFeather, k, layer3Num, curvatureAmount);
	}
	
	for(var l = 0; l < layer4Num; l++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + (i + j + k + l));
		updateYPosition(currentFeather, l, layer4Num, curvatureAmount);
	}
}

function updateZPositions(framework, exponent) {
	for(var i = 0; i < layer1Num; i++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + i);
		updateZPosition(currentFeather, i, layer1Num, exponent);
	}
	
	for(var j = 0; j < layer2Num; j++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + (i + j));
		updateZPosition(currentFeather, j, layer2Num, exponent);
	}
	
	for(var k = 0; k < layer3Num; k++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + (i + j + k));
		updateZPosition(currentFeather, k, layer3Num, exponent);
	}
	
	for(var l = 0; l < layer4Num; l++) {
		var currentFeather = framework.scene.getObjectByName("feather_" + (i + j + k + l));
		updateZPosition(currentFeather, l, layer4Num, exponent);
	}
}

function UpdateColor(framework, newColor) {
	for(var i = 0; i < numFeathers; i++) {
		var currentFeather = framework.scene.getObjectByName('feather_group').children[i];
		currentFeather.material.color.set(new THREE.Color(newColor));
	}
}

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
    
    /* GUI related parameters */
    
    //create methods for each of these, have to iterate over each feather using
    //get object by name and start with the corresponding integer offset
    var interpolationExponent = { distribution: 0.5 }; //This is NOT per layer. changes how the position of the feathers is interpolated, default to 2, as it is now. Have to alter every feather's position.
    
    //this one is for all feathers at once
    var curvature = { curvature : 0 }; //have all feathers uniformly scale up their y-axis position, which should be quadratically lerped. first 3 layers default 0 to 0, fourth has a lil offset.
    
    var x_orientation = { x_orientation : 0};
    var y_orientation = { y_orientation : 0};
    var z_orientation = { z_orientation : 0}; //This is NOT per layer. rotate each individual feather by what ever amount
    
    var x_scale = { x_scale : 1};
    var y_scale = { y_scale : 1};
    var z_scale = { z_scale : 1};
    
    var wingColor = { value : 0x000000 }; //Per layer - alter the material color of each feather's material by whatever newVal
    
    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    objLoader.load('/geo/feather.obj', function(obj) {

        // LOOK: This function runs after the obj has finished loading
        var featherGeo = obj.children[0].geometry;
        
        //Create the first layer of feathers- actually the 3rd layer if counting outwards
        for(var i = 0; i < layer1Num; i++) {
        	var featherMesh = new THREE.Mesh(featherGeo, physGold);
        	featherMesh.name = "feather_" + i;
        	layer1(featherMesh, i, layer1Num, 0.5);
        	//scene.add(featherMesh);
        	featherGroup.add(featherMesh);
   		}
   		
   		for(var j = 0; j < layer2Num; j++) {
   			var featherMesh = new THREE.Mesh(featherGeo, physGreen);
        	featherMesh.name = "feather_" + (j + i);
        	layer2(featherMesh, j, layer2Num, 0.5);
        	//scene.add(featherMesh);
        	featherGroup.add(featherMesh);
   		}
   		
   		for(var k = 0; k < layer3Num; k++) {
   			var featherMesh = new THREE.Mesh(featherGeo, physBlue);
        	featherMesh.name = "feather_" + (k + j + i);
        	layer3(featherMesh, k, layer3Num, 0.5);
        	//scene.add(featherMesh);
        	featherGroup.add(featherMesh);
   		}   		
   		
   		for(var l = 0; l < layer4Num; l++) {
   			var featherMesh = new THREE.Mesh(featherGeo, physRed);
        	featherMesh.name = "feather_" + (l + k + j + i);
        	layer4(featherMesh, l, layer4Num, 0.5);
        	//scene.add(featherMesh);
        	featherGroup.add(featherMesh);
   		}
   		scene.add(featherGroup);
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
    
    gui.add(interpolationExponent, 'distribution', 0.1, 5).onChange(function(newVal) {
        updateZPositions(framework, newVal);
    });
    
    gui.add(curvature, 'curvature', 0, 50).onChange(function(newVal) {
        updateYPositions(framework, newVal);
    });
    
    gui.add(flappingSpeed, 'flappingSpeedScale', 0.1, 10);
    gui.add(flappingMotion, 'flappingMotionScale', 0.1, 10);
    
    //Can't get these to work with non-integer steps
    gui.add(x_orientation, 'x_orientation', 0.0, 10.0).step(0.1).listen().onChange(function(newVal) {
        updateXRotations(framework, newVal);
    });
    
    gui.add(y_orientation, 'y_orientation', 0.0, 10.0).step(0.1).listen().onChange(function(newVal) {
        updateYRotations(framework, newVal);
    });
    
    gui.add(z_orientation, 'z_orientation', 0.0, 10.0).step(0.1).listen().onChange(function(newVal) {
        updateZRotations(framework, newVal);
    });
    
    gui.add(windIntensity, 'wind_intensity', 0.01, 20.1);
    
    gui.add(x_scale, 'x_scale', 0.5, 10.0).step(0.1).listen().onChange(function(newVal) {
        UpdateXScales(framework, newVal);
    });
    
    gui.add(y_scale, 'y_scale', 0.5, 10.0).step(0.1).listen().onChange(function(newVal) {
        UpdateYScales(framework, newVal);
    });
    
    gui.add(z_scale, 'z_scale', 0.5, 10.0).step(0.1).listen().onChange(function(newVal) {
        UpdateZScales(framework, newVal);
    });
    
    gui.addColor(wingColor, 'value').name('Wing Color').onChange(function(newVal) {
    	//iterate over all the feathers and add this color
    	UpdateColor(framework, newVal);
    });
}

// called on frame updates
function onUpdate(framework) {
	//for(var i = 0; i < numFeathers; i++) {
		var featherGroup = framework.scene.getObjectByName('feather_group');//.children[i];
		
		//Flap the feather
		if (featherGroup !== undefined) {
        	var date = new Date();
        	//featherGroup.rotateX(flappingMotion.flappingMotionScale* Math.sin(date.getTime() * flappingSpeed.flappingSpeedScale / 100) * 2 * Math.PI / 180);
        	flapEachFeather(framework, flappingMotion.flappingMotionScale, Math.sin(date.getTime() * flappingSpeed.flappingSpeedScale / 1000));
        	ApplyWind(framework);
    	}
	//}
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);