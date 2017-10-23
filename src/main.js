
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

var featherGeo;
var feathers = [];
var materials = [];
var baseColor = 0x002db3;

// Set up GUI variables
var guiVariables = function() {
   this.subdivisions = 20;
   this.subdivisionsMult = 1.25;
   this.color = 1;
   this.colorBias = 0.2;
   this.largePlumeCurve = 0.5;
   this.middlePlumeCurve = 0.6;
   this.smallPlumeCurve = 0.5;
   this.orientation = 1.5;
   this.flappingSpeed = 1;
   this.flappingMotion = 1;
   this.windX = 0;
   this.windY = 0;
   this.windSpeed = 1;
}
// Init shader variables
var guiVar = new guiVariables();

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Basic Lambert white
    var lambertWhite = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = 'https://raw.githubusercontent.com/emily-vo/Project2-Toolbox-Functions/master/images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();

    var headGeo;
    var headMesh;

    objLoader.load('https://raw.githubusercontent.com/emily-vo/Avian/master/geo/parrot.obj', function(obj) {
        featherGeo = obj.children[0].geometry;
        headMesh = new THREE.Mesh(headGeo, lambertWhite);
        scene.add(headMesh);
    });
    function repaint() {
        // Set light
        // remove all scene children
        for (var i = 0; i < feathers.length; i++) {
            scene.remove(feathers[i]);
        }
        for (var i = 0; i < scene.children.length; i++) {
            scene.remove(scene.children[i]);
        }
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.color.setHSL(0.1, 1, 0.95);
        directionalLight.position.set(1, 3, 2);
        directionalLight.position.multiplyScalar(10);

        materials = [];
        feathers = [];
        var curve = new THREE.QuadraticBezierCurve3();

        objLoader.load('https://raw.githubusercontent.com/emily-vo/Avian/master/geo/feather.obj', function(obj) {
            // Add a simple curve
            var SUBDIVISIONS = guiVar.subdivisions;
            var SUBDIVMULT = guiVar.subdivisionsMult;
            var geometry = new THREE.Geometry();
            curve = new THREE.QuadraticBezierCurve3();
            curve.v0 = new THREE.Vector3(-7, 2, -4);
            curve.v1 = new THREE.Vector3(-4, 2, -4);
            curve.v2 = new THREE.Vector3(-1, 3, -4);
        
            for (var j = 0; j < SUBDIVISIONS; j++) {
               geometry.vertices.push( curve.getPoint(j / SUBDIVISIONS));
            }
            
            var material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
            var line = new THREE.Line(geometry, material);
        
            scene.add(line);

            // LOOK: This function runs after the obj has finished loading
            featherGeo = obj.children[0].geometry;
            var idx = 0;

            // Draw large plume
            for (var i = 0.0; i <= 1; i += 1 / (SUBDIVISIONS)) {
                materials[i] = new THREE.MeshLambertMaterial({ color: baseColor});
                feathers[idx] = new THREE.Mesh(featherGeo, materials[i]);
                var r = feathers[idx].material.color.r;
                var g = feathers[idx].material.color.g + bias(0.2, i);
                var b = feathers[idx].material.color.b + bias(0.2, i);;
                feathers[idx].material.color.setRGB(r, g, b);

                // Set position
                feathers[idx].position.x = curve.getPoint(i).x;
                feathers[idx].position.y = curve.getPoint(i).y;
                feathers[idx].position.z = curve.getPoint(i).z;

                // Set rotation
                feathers[idx].rotation.y = 180 + easeInQuadratic(guiVar.orientation*i);
                feathers[idx].rotation.x = -80;

                // Set scale
                
                feathers[idx].scale.set(5*bias(guiVar.largePlumeCurve, i), 5*bias(guiVar.largePlumeCurve, i), 5*bias(guiVar.largePlumeCurve, i));
                scene.add(feathers[idx]);
                idx++;
            }

            // Draw smaller plume
            for (var i = 0.25; i <= 1; i += 1 / (SUBDIVISIONS)) {
                materials[i] = new THREE.MeshLambertMaterial({ color: baseColor, side: THREE.DoubleSide });
                feathers[idx] = new THREE.Mesh(featherGeo, materials[i]);
                var r = feathers[idx].material.color.r;
                var g = feathers[idx].material.color.g + 2*bias(guiVar.colorBias, i);
                var b = feathers[idx].material.color.b + 2*bias(guiVar.colorBias, i);
                feathers[idx].material.color.setRGB(r, g, b);

                // Set position
                feathers[idx].position.x = curve.getPoint(i).x;
                feathers[idx].position.y = curve.getPoint(i).y;
                feathers[idx].position.z = curve.getPoint(i).z + 0.25;

                // Set rotation
                feathers[idx].rotation.y = 180 + easeInQuadratic(guiVar.orientation*i);
                feathers[idx].rotation.x = -80;

                // Set scale
                feathers[idx].scale.set(bias(guiVar.middlePlumeCurve
            , i) + 1, bias(guiVar.middlePlumeCurve
        , i) + 1, bias(guiVar.middlePlumeCurve
        , i) + 1);
                scene.add(feathers[idx]);
                idx++;
            }

            // Draw smallest plume
            for (var i = 0.25; i <= 1; i += 1 / (SUBDIVISIONS)) {
                materials[i] = new THREE.MeshLambertMaterial({ color: baseColor, side: THREE.DoubleSide });
                feathers[idx] = new THREE.Mesh(featherGeo, materials[i]);
                var r = feathers[idx].material.color.r;
                var g = feathers[idx].material.color.g + bias(guiVar.colorBias, i);
                var b = feathers[idx].material.color.b + bias(guiVar.colorBias, i);
                feathers[idx].material.color.setRGB(r, g, b);

                // Set position
                feathers[idx].position.x = curve.getPoint(i).x;
                feathers[idx].position.y = curve.getPoint(i).y;
                feathers[idx].position.z = curve.getPoint(i).z + 0.5;

                // Set rotation
                feathers[idx].rotation.y = 180 + easeInQuadratic(guiVar.orientation*i);
                feathers[idx].rotation.x = -80;

                // Set scale
                console.log(bias(3, i));
                feathers[idx].scale.set(bias(guiVar.smallPlumeCurve, i) + 0.5, bias(guiVar.smallPlumeCurve, i) + 0.5, bias(guiVar.smallPlumeCurve, i) + 0.5);
                scene.add(feathers[idx]);
                idx++;
            } 
        });
   
    // set camera position
    camera.position.set(0, 1, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // scene.add(lambertCube);
    scene.add(directionalLight);
    }

    repaint();

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
    gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });
    gui.add(guiVar, 'subdivisions', 10, 30).onChange(function(newVal) {
        repaint();
    });
    gui.add(guiVar, 'color', 0, 1).onChange(function(newVal) {
        var color1 = 0x002db3;
        var color2 = 0xe8122f;
        baseColor = lerp(color1, color2, guiVar.color);
        repaint();
    });
    gui.add(guiVar, 'colorBias', 0, 1).onChange(function(newVal) {
        repaint();
    });
    gui.add(guiVar, 'largePlumeCurve', 0, 1).onChange(function(newVal) {
        repaint();
    });
    gui.add(guiVar, 'middlePlumeCurve', 0, 1).onChange(function(newVal) {
        repaint();
    });
    gui.add(guiVar, 'smallPlumeCurve', 0, 1).onChange(function(newVal) {
        repaint();
    });
    gui.add(guiVar, 'orientation', 1.4, 2).onChange(function(newVal) {
        repaint();
    });
    gui.add(guiVar, 'flappingSpeed', 0.5, 2).onChange(function(newVal) {
        repaint();
    });
    gui.add(guiVar, 'flappingMotion', 0, 2).onChange(function(newVal) {
        repaint();
    });

    gui.add(guiVar, 'windX', 0, 1).onChange(function(newVal) {
    });
    gui.add(guiVar, 'windY', 0, 1).onChange(function(newVal) {
    });
    gui.add(guiVar, 'windSpeed', 0, 10).onChange(function(newVal) {
    });
}
function lerp(a0, a1, t) {
    return t+a0 + (1-t)*a1;
}
function bias(b, t) {
    return Math.pow(t, Math.log(b) / Math.log(0.5));
}

function easeInQuadratic(t) {
    return t*t;
}
function easeOutQuadratic(t) {
    return 1 - easeInQuadratic(1-t);
}

// called on frame updates
function onUpdate(framework) {
    for (var i = 0; i <  feathers.length; i++) {
        var date = new Date();
        //feathers[i].position.z += easeInQuadratic(feathers[i].position.x)/100* Math.sin(date.getTime());
        //feathers[i].rotation.x += Math.sin(date.getTime() * (Math.random() - 0.5)/ 1000) * 2 * Math.PI / 900;
        //feathers[i].rotation.y += Math.sin(date.getTime() * (Math.random()/5) / 1000) * 2 * Math.PI / 900;
        feathers[i].rotateX(guiVar.windX*Math.sin(guiVar.windSpeed*date.getTime() * 5000) * 2 * Math.PI * Math.sin(i) / 900);
        feathers[i].rotateY(guiVar.windY*Math.sin(guiVar.windSpeed*date.getTime() * 5000) * 2 * Math.PI * Math.sin(i) / 900);
        feathers[i].rotateZ(guiVar.flappingMotion*Math.sin(date.getTime() / 100 * guiVar.flappingSpeed) * 2 * Math.PI / 180);
    }
           
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);