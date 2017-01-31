const THREE = require('three');

function lerp(a, b, w) {
	return a * (1 - w) + b * (w);
}

function jitter(numToJitter, magnitudeOfJitter) {
	//return a random number on [-0.5, 0.5), of the given magnitude, added to the desired number
	return (Math.random() - 0.5) * magnitudeOfJitter + numToJitter;
}

export function layer1(featherMesh, i, numFeathersInlayer) {
	//Positions
	var startXPos = 0;
	var endXPos = 2;
	
	var startZPos = 0;
	var endZPos = 16;
	
	//Rotations
	var startRotY = Math.PI / 2;
	var endRotY = Math.PI;
	
	//Weight reltive to this layer
	var weight = i / numFeathersInlayer; //normalize to [0, 1)
	
	//lerp the positions and rotations
	featherMesh.position.x += lerp(startXPos, endXPos, Math.pow(weight, 2.1));
	featherMesh.position.z += lerp(startZPos, endZPos, Math.pow(weight, 0.5));
	featherMesh.rotateY(lerp(startRotY, endRotY, weight));
	
	//scale down immensely for the first layer - need to change the positions
	//or it will be more spread out
	//for now, lerp the scale quadratically-  small to Big
	var startScale = 2;
	var endScale = 0.25;
	var scaleVal = lerp(startScale, endScale, Math.pow(weight, 3));
	featherMesh.scale.set(scaleVal, scaleVal, scaleVal);
	
	//Jitter the feather position along the y-axis a little
	featherMesh.position.y += jitter(0, 0.01);
	
	//Jitter the red component of the color a little, cloning each matieral per feather
	var m = featherMesh.material.clone();
	featherMesh.material = m;
	featherMesh.material.color.add(new THREE.Color(jitter(0.75, 0.75), jitter(0.5, 0.5), 0));
}

export function layer2(featherMesh, j, numFeathersInlayer) {
	var startXPos2 = 0;
	var endXPos2 = 2;
	
	var startZPos2 = 0;
	var endZPos2 = 16;
	var weight = j / numFeathersInlayer;
	
	var startRotY = Math.PI / 2 - 0.1;
	var endRotY = Math.PI;
	
	var startScale2 = 1.1;
	var endScale2 = 0.05;
	var scaleVal = lerp(startScale2, endScale2, Math.pow(weight, 3));
	featherMesh.scale.set(scaleVal, scaleVal, scaleVal);
	
	//place a second layer of smaller feather into the wing with jittered y-value positions
	featherMesh.position.x += lerp(startXPos2, endXPos2, Math.pow(weight, 2.1));
	featherMesh.position.z += lerp(startZPos2, endZPos2, Math.pow(weight, 0.5));
	featherMesh.rotateY(lerp(startRotY, endRotY, weight));
	
	//Jitter the feather position along the y-axis a little
	featherMesh.position.y += jitter(0.05, 0.05);
	
	//Jitter the red component of the color a little, cloning each matieral per feather
	var m = featherMesh.material.clone();
	featherMesh.material = m;
	featherMesh.material.color.add(new THREE.Color(jitter(0, 0.2), jitter(0, 0.2), 0));
}

export function layer3(featherMesh, k, numFeathersInlayer) {
	var startXPos2 = 0;
	var endXPos2 = 2;
	
	var startZPos2 = 0;
	var endZPos2 = 16;
	var weight = k / numFeathersInlayer;
	
	var startRotY = Math.PI / 2 - 0.1;
	var endRotY = Math.PI;
	
	var startScale2 = 0.5;
	var endScale2 = 0.02;
	var scaleVal = lerp(startScale2, endScale2, Math.pow(weight, 3));
	featherMesh.scale.set(scaleVal, scaleVal, scaleVal);
	
	//place a second layer of smaller feather into the wing with jittered y-value positions
	featherMesh.position.x += lerp(startXPos2, endXPos2, Math.pow(weight, 2.1));
	featherMesh.position.z += lerp(startZPos2, endZPos2, Math.pow(weight, 0.5));
	featherMesh.rotateY(lerp(startRotY, endRotY, weight));
	
	//Jitter the feather position along the y-axis a little
	featherMesh.position.y += 0.1;//jitter(0.08, 0);
	
	//Jitter the color a little, cloning each matieral per feather
	var m = featherMesh.material.clone();
	featherMesh.material = m;
	featherMesh.material.color.add(new THREE.Color(0, 0, jitter(0, 0.2)));
}

export function layer4(featherMesh, l, numFeathersInlayer) {
	var startXPos2 = -0.5;
	var endXPos2 = 2;
	
	var startZPos2 = -2;
	var endZPos2 = 16.1;
	var weight = l / numFeathersInlayer;
	
	var startRotY = Math.PI / 2;
	var endRotY = Math.PI;
	
	
	var startScale2 = 2.5;
	var endScale2 = 1.5;
	var scaleVal = lerp(startScale2, endScale2, Math.pow(weight, 3));
	featherMesh.scale.set(scaleVal, scaleVal, scaleVal);
	
	//place a second layer of smaller feather into the wing with jittered y-value positions
	featherMesh.position.x += lerp(startXPos2, endXPos2, Math.pow(weight, 2.1));
	featherMesh.position.z += lerp(startZPos2, endZPos2, Math.pow(weight, 0.5));
	featherMesh.rotateY(lerp(startRotY, endRotY, weight));
	
	//Jitter the feather position along the y-axis a little
	featherMesh.position.y += -0.08;//jitter(-0.05, 0.00);
	
	//Jitter the color a little, cloning each matieral per feather
	var m = featherMesh.material.clone();
	featherMesh.material = m;
	featherMesh.material.color.add(new THREE.Color(0, jitter(0, 0.5), 0));
}

/*
// http://stackoverflow.com/questions/12537141/how-to-shear-a-cube-in-three-js
export function shear(mesh) {
	var shearMatrix = new THREE.Matrix4();
	
	shearMatrix.set ( 1, Syx, Szx, 0,
					  Sxy, 1, Szx, 0,
					  1, Syx, 1, 0,
					  1, Syx, Szx, 1 );
	
}
*/