
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

var freq = {
    Frequency: 600
}
var amp = {
    Amplitude: 7
}

var d = {
    Dance: 56
}

var o ={
    Orient: 0
}

var toggle = false;

var windspeed = {
    WindSpeed: 0
    }

var scale = {
    ScaleFeathers: 1
}

var toggle1 = false;

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Basic Lambert white
    var lambertWhite = new THREE.MeshLambertMaterial({ color: 0x4F2B08, side: THREE.DoubleSide });
    
    //lambert light blue and green
    var lambertLB = new THREE.MeshLambertMaterial({ color: 0x7A430C, side: THREE.DoubleSide });
    var lambertG = new THREE.MeshLambertMaterial({ color: 0xA6703A, side: THREE.DoubleSide });

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

        
        //base curve
        var curve = new THREE.CatmullRomCurve3( [
	       new THREE.Vector3( 0, 0, 0 ),
	       new THREE.Vector3( 0.25, 0, 0.8),
	       new THREE.Vector3( 0.1, 0, 2),
	       new THREE.Vector3( 0, 0, 3),
           new THREE.Vector3( 0.3, 0, 3.8),    
	       new THREE.Vector3( 0, 0, 4.5) 
            ] );
        
        //base feathers
        var no_of_feathers_base = 31;
        for(var i =1; i < no_of_feathers_base; i++)
            {
                var new_fm = new THREE.Mesh(featherGeo, lambertWhite);
                new_fm.name = "feather" + i;
                var f_pos = curve.getPoint(i / (no_of_feathers_base - 1));
    
                
                //setting up the feather pos on the curve points 
                new_fm.position.x = f_pos.x;
                new_fm.position.y = f_pos.y;
                new_fm.position.z = f_pos.z;
            
                //scaling the feathers
                new_fm.scale.set(f_pos.x + 1,1,1);
                
                if(i == no_of_feathers_base - 11)
                    {
                        new_fm.rotateY( (no_of_feathers_base - 11 - i - 1) * 1.5 * 2 * Math.PI / 180);
                    }
                
                //rotating the feathers towards the end
                if(i >= no_of_feathers_base - 10)
                    {
                        //console.log(new_fm.position.z);
                        //new_fm.position.z = 3.65;
                        new_fm.rotateY( (no_of_feathers_base - 10 - i - 1) * 5 * 2 * Math.PI / 180);    
                    }
                
                //rotating the feathers by a slight value
                new_fm.rotateY(-8 * Math.PI / 180);
                
                //adding the feathures to the scene
                scene.add(new_fm);
                
                //-------------------------------------------------------------------
                //second feather
                var new_fm = new THREE.Mesh(featherGeo, lambertWhite);
                new_fm.name = "feather" + i + 30;
                var f_pos = curve.getPoint(i / (no_of_feathers_base - 1));
    
                
                //setting up the feather pos on the curve points 
                new_fm.position.x = f_pos.x;
                new_fm.position.y = f_pos.y;
                new_fm.position.z = -f_pos.z;
            
                //scaling the feathers
                new_fm.scale.set(f_pos.x + 1,1,1);
                
                if(i == no_of_feathers_base - 11)
                    {
                        new_fm.rotateY( -(no_of_feathers_base - 11 - i - 1) * 1.5 * 2 * Math.PI / 180);
                    }
                
                //rotating the feathers towards the end
                if(i >= no_of_feathers_base - 10)
                    {
                        //console.log(new_fm.position.z);
                        //new_fm.position.z = 3.65;
                        new_fm.rotateY( -(no_of_feathers_base - 10 - i - 1) * 5 * 2 * Math.PI / 180);    
                    }
                
                //rotating the feathers by a slight value
                new_fm.rotateY(8 * Math.PI / 180);
                
                //adding the feathures to the scene
                scene.add(new_fm);
            }
        
        
        //feathers on top1        
        var no_of_feathers_top1 = 31;
        for(var i =1; i < no_of_feathers_top1; i++)
            {
                var new_fm = new THREE.Mesh(featherGeo, lambertLB);
                new_fm.name = "feather" + i + 60;
                var f_pos = curve.getPoint(i / (no_of_feathers_top1 - 1));
    
                
                //setting up the feather pos on the curve points 
                new_fm.position.x = f_pos.x;
                new_fm.position.y = f_pos.y + 0.07;
                new_fm.position.z = f_pos.z + 0.1;
            
                //scaling the feathers
                new_fm.scale.set(f_pos.x + 0.6,1,1);
                
                if(i == no_of_feathers_top1 - 11)
                    {
                        new_fm.rotateY( (no_of_feathers_top1 - 11 - i - 1) * 1.5 * 2 * Math.PI / 180);
                    }
                
                //rotating the feathers towards the end
                if(i >= no_of_feathers_top1 - 10)
                    {
                        //console.log(new_fm.position.z);
                        //new_fm.position.z = 3.65;
                        new_fm.rotateY( (no_of_feathers_top1 - 10 - i - 1) * 5 * 2 * Math.PI / 180);    
                    }
            
                
                //rotating the feathers by a slight value
                new_fm.rotateY(-10 * Math.PI / 180);
                
                //adding the feathures to the scene
                scene.add(new_fm);
                
                //-------------------------------------------------------------------
                var new_fm = new THREE.Mesh(featherGeo, lambertLB);
                new_fm.name = "feather" + i + 90;
                var f_pos = curve.getPoint(i / (no_of_feathers_top1 - 1));
    
                
                //setting up the feather pos on the curve points 
                new_fm.position.x = f_pos.x;
                new_fm.position.y = f_pos.y + 0.07;
                new_fm.position.z = -(f_pos.z + 0.1);
            
                //scaling the feathers
                new_fm.scale.set(f_pos.x + 0.6,1,1);
                
                if(i == no_of_feathers_top1 - 11)
                    {
                        new_fm.rotateY( -(no_of_feathers_top1 - 11 - i - 1) * 1.5 * 2 * Math.PI / 180);
                    }
                
                //rotating the feathers towards the end
                if(i >= no_of_feathers_top1 - 10)
                    {
                        //console.log(new_fm.position.z);
                        //new_fm.position.z = 3.65;
                        new_fm.rotateY( -(no_of_feathers_top1 - 10 - i - 1) * 5 * 2 * Math.PI / 180);    
                    }
            
                
                //rotating the feathers by a slight value
                new_fm.rotateY(10 * Math.PI / 180);
                
                //adding the feathures to the scene
                scene.add(new_fm);
            }
        

        //feathers on top2        
        var no_of_feathers_top2 = 31;
        for(var i =1; i < no_of_feathers_top2; i++)
            {
                var new_fm = new THREE.Mesh(featherGeo, lambertG);
                new_fm.name = "feather" + i + 120;
                var f_pos = curve.getPoint(i / (no_of_feathers_top2 - 1));
    
                
                //setting up the feather pos on the curve points 
                new_fm.position.x = f_pos.x;
                new_fm.position.y = f_pos.y + 0.15;
                new_fm.position.z = f_pos.z + 0.15;
            
                //scaling the feathers
                new_fm.scale.set(f_pos.x + 0.3,1,1);
                
                if(i == no_of_feathers_top2 - 11)
                    {
                        new_fm.scale.set(0.35,1,1);
                        new_fm.rotateY( (no_of_feathers_top2 - 11 - i - 1) * 1.5 * 2 * Math.PI / 180);
                    }
                
                //rotating the feathers towards the end
                if(i >= no_of_feathers_top2 - 10)
                    {
                        new_fm.scale.set(0.4,1,1);
                        //console.log(new_fm.position.z);
                        //new_fm.position.z = 3.65;
                        new_fm.rotateY( (no_of_feathers_top2 - 10 - i - 1) * 5 * 2 * Math.PI / 180);    
                    }
            
                
                //adding the feathures to the scene
                scene.add(new_fm);
                
                //-------------------------------------------------------------------
                var new_fm = new THREE.Mesh(featherGeo, lambertG);
                new_fm.name = "feather" + i + 150;
                var f_pos = curve.getPoint(i / (no_of_feathers_top2 - 1));
    
                
                //setting up the feather pos on the curve points 
                new_fm.position.x = f_pos.x;
                new_fm.position.y = f_pos.y + 0.15;
                new_fm.position.z = -(f_pos.z + 0.15);
            
                //scaling the feathers
                new_fm.scale.set(f_pos.x + 0.3,1,1);
                
                if(i == no_of_feathers_top2 - 11)
                    {
                        new_fm.scale.set(0.35,1,1);
                        new_fm.rotateY( -(no_of_feathers_top2 - 11 - i - 1) * 1.5 * 2 * Math.PI / 180);
                    }
                
                //rotating the feathers towards the end
                if(i >= no_of_feathers_top2 - 10)
                    {
                        new_fm.scale.set(0.4,1,1);
                        //console.log(new_fm.position.z);
                        //new_fm.position.z = 3.65;
                        new_fm.rotateY( -(no_of_feathers_top2 - 10 - i - 1) * 5 * 2 * Math.PI / 180);    
                    }
            
                
                //adding the feathures to the scene
                scene.add(new_fm);

                
            }
        
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
    
    //gui for changing falpping attributes
    gui.add(freq, 'Frequency', 10, 1000).onChange(function(newVal1) {
        freq.Frequency = newVal1;
    });
    
    gui.add(amp, 'Amplitude', 0.001, 10).onChange(function(newVal2) {
        amp.Amplitude = newVal2;
    });
    
    gui.add(d, 'Dance', 0.01, 200).onChange(function(newVal3) {
        d.Dance = newVal3;
    });
    
    gui.add(o, 'Orient', 0, 360, 1).onChange(function(newVal4) {
        o.Orient = newVal4;
        toggle = true;
    });
    
    gui.add(windspeed, 'WindSpeed', 0, 25, 1).onChange(function(newVal5) {
        windspeed.WindSpeed = newVal5;
    });
    
    gui.add(scale, 'ScaleFeathers', 1, 10, 0.5).onChange(function(newVal6) {
        scale.ScaleFeathers = newVal6;
        toggle1 = true;
    });
    
}

// called on frame updates
function onUpdate(framework) {
    var feather = framework.scene.getObjectByName("feather");    
    if (feather !== undefined) {
        // Simply flap wing
        var date = new Date();
        //feather.rotateZ(Math.sin(date.getTime() / 100) * 2 * Math.PI / 180);        
    }
    
    var frequency = (1000-freq.Frequency);
    var amplitude = (10 - amp.Amplitude);
    var dance = d.Dance;
    var orient = o.Orient;
    var windsp = windspeed.WindSpeed;
    var scaleF = scale.ScaleFeathers;
    
    //flapping wings!!!
    for(var i = 1 ;i < 31; i++)
        {
            var date = new Date();
            var val_date = date.getTime();
            
            var base_f_ypos = 0;
            var top1_f_ypos = 0;
            var top2_f_ypos = 0;
            
            //base feathers----------------------------------------------------------
            //base feather
            var base_feather = framework.scene.getObjectByName("feather" + i);
            if(base_feather !== undefined){   
            
            base_feather.position.y = base_feather.position.z *  Math.sin(((base_feather.position.z * dance +val_date)/frequency) % 360) / amplitude;
            
            base_f_ypos = base_feather.position.y;    
            //X orientation
                if(toggle === true){
            base_feather.rotateX(orient);
                }
                
            //wind effects
                //base_feather.rotateX(math.sin(val_date));
            base_feather.position.x = Math.sin( (base_feather.position.x * base_feather.position.z * val_date / 100) % 360) / (30-windsp);
              
            //feather size
            if(toggle1 === true){              
                base_feather.scale.set(scaleF, 1, 1);
                //base_feather.scale.addScalar(scaleF);
                }
                
                
            }
            
            //base feather1
            var base_feather1 = framework.scene.getObjectByName("feather" + i + 30);
            if(base_feather1 !== undefined){   
            
//            base_feather1.position.y = -(base_feather1.position.z *  Math.sin(((base_feather1.position.z * dance +val_date)/frequency) % 360) / amplitude);
                base_feather1.position.y = base_f_ypos;
                
            //X orientation
                if(toggle === true){
            base_feather1.rotateX(orient);
                }
                
            //wind effects
                //base_feather.rotateX(math.sin(val_date));
            base_feather1.position.x = Math.sin( (base_feather1.position.x * base_feather1.position.z * val_date / 100) % 360) / (30-windsp);
              
            //feather size
            if(toggle1 === true){
                base_feather1.scale.set(scaleF, 1, 1);
                }    
                
            }
            
            
            
            //top1 feathers------------------------------------------------------------
            //top1 feathers
            var top1_feather = framework.scene.getObjectByName("feather" + i + 60);
            if(top1_feather !== undefined){
            var date = new Date();
                
            top1_feather.position.y = top1_feather.position.z * Math.sin(((top1_feather.position.z * dance +val_date)/frequency) % 360) / amplitude;
                
                
            top1_f_ypos = top1_feather.position.y;    
            //X orientation
                if(toggle === true){
            top1_feather.rotateX(orient);  
                }
                
            //wind effects
                //base_feather.rotateX(math.sin(val_date));
                top1_feather.position.x = Math.sin( (top1_feather.position.x * top1_feather.position.z * val_date / 100) % 360) / (30 - windsp);
                
                //feather size
                if(toggle1 === true){
                top1_feather.scale.set(scaleF, 1, 1);
                }
                
            }
            
            //top1 feathers1
            var top1_feather1 = framework.scene.getObjectByName("feather" + i + 90);
            if(top1_feather1 !== undefined){
            var date = new Date();
                
//            top1_feather1.position.y = -(top1_feather1.position.z * Math.sin(((top1_feather1.position.z * dance +val_date)/frequency) % 360) / amplitude);
                
                top1_feather1.position.y = top1_f_ypos;
                
            //X orientation
                if(toggle === true){
            top1_feather1.rotateX(orient);  
                }
                
            //wind effects
                //base_feather.rotateX(math.sin(val_date));
                top1_feather1.position.x = Math.sin( (top1_feather1.position.x * top1_feather1.position.z * val_date / 100) % 360) / (30 - windsp);
                
                //feather size
                if(toggle1 === true){
                top1_feather1.scale.set(scaleF, 1, 1);
                }
                
            }
            
            
            //top2 feathers--------------------------------------------------------------------------
            //top2 feather
            var top2_feather = framework.scene.getObjectByName("feather" + i + 120);
            if(top2_feather !== undefined){
            var date = new Date();
                
            top2_feather.position.y = top2_feather.position.z * Math.sin(((top2_feather.position.z * dance +val_date)/frequency) % 360) / amplitude;
                
            top2_f_ypos = top2_feather.position.y;    
                
            //X orientation
                if(toggle === true){
            top2_feather.rotateX(orient);  
                }
                
            //wind effects
                //base_feather.rotateX(math.sin(val_date));
                top2_feather.position.x = Math.sin( (top2_feather.position.x * top2_feather.position.z * val_date / 100) % 360) / (30 - windsp);
                
                //feather size
                if(toggle1 === true){
                top2_feather.scale.set(scaleF, 1, 1);
                }
                
            }
            
            //top2 feather1
            var top2_feather1 = framework.scene.getObjectByName("feather" + i + 150);
            if(top2_feather1 !== undefined){
            var date = new Date();
                
//            top2_feather1.position.y = -(top2_feather1.position.z * Math.sin(((top2_feather1.position.z * dance +val_date)/frequency) % 360) / amplitude);
                
                top2_feather1.position.y = top2_f_ypos;
                
            //X orientation
                if(toggle === true){
            top2_feather1.rotateX(orient);  
                }
                
            //wind effects
                //base_feather.rotateX(math.sin(val_date));
                top2_feather1.position.x = Math.sin( (top2_feather1.position.x * top2_feather1.position.z * val_date / 100) % 360) / (30 - windsp);
                
                //feather size
                if(toggle1 === true){
                top2_feather1.scale.set(scaleF, 1, 1);
                }
                
            }
            
            
        }
    toggle = false;
    toggle1 = false;
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);