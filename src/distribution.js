const THREE = require('three');

var curvature = 1.0; //controls y positions of feathers on curve, ranges from 0 to 4, higher curvature means more variation in y positions
var featherDistribution = 0.5; //controls bias of feather positions, ranges 0 to 1
var featherSize = 1.0; //controls max scale values of feathers, ranges from 0 to 2
var featherOrientation = 0.0; //controls an extra rotation about y, ranges from -1 to 1
var windSpeed = 0.5; //speed of wind, ranges from 0 to 1, affects noise of feather displacement from sporadic to light
var flapSpeed = 1.0; //speed of wind, ranges from 0 to 5, affects speed of flap cycle
var windDirection = 45.0; //angle of wind parallel to y direction, goes from 0 to 360 degrees where 0 is straight down
var time = 0.0; //in order to animate with wind
var color = 1.0; //indicates the color palette, either 1 or 2

export function incTime()
{
	time++;
}

export function changeColor()
{
	if(color == 1){ color = 2; }
	else { color = 1; }
}

export function updateCurve(newVal)
{
	curvature = newVal;
}

export function updateDistrib(newVal)
{
	featherDistribution = newVal;
}

export function updateSize(newVal)
{
	featherSize = newVal;
}

export function updateOrient(newVal)
{
	featherOrientation = newVal;
}

export function updateSpeed(newVal)
{
	windSpeed = newVal;
}

export function updateFlapSpeed(newVal)
{
	flapSpeed = newVal;
}

export function updateDir(newVal)
{
	windDirection = newVal;
}

export function getPos(mesh, settings)
{
	var b = featherDistribution;
	var g = 0.4;

	if(settings.num < settings.total1)
	{
		var t = gain(g, bias(b, settings.num/settings.total1));
		t = Math.round(t*100);
		var pos = settings.curve.getPoints(100)[t];
    	mesh.position.set(pos.x, pos.y*curvature, pos.z);
	}
	else if(settings.num < settings.total2)
	{
		var t = gain(g, bias(b, (settings.num-settings.total1)/(settings.total2-settings.total1)));
		t = Math.round(t*70);
		var pos = settings.curve.getPoints(100)[100-t];
    	mesh.position.set(pos.x, pos.y*curvature, pos.z+0.05);
	}
	else
	{
		var t = gain(g, bias(b, (settings.num-settings.total2)/(settings.total3-settings.total2)));
		t = Math.round(t*55);
		var pos = settings.curve.getPoints(100)[100-t];
    	mesh.position.set(pos.x, pos.y*curvature, pos.z+0.1);
	}
}

export function getRot(mesh, settings)
{
	var t;
	var zmax;
	var zmin;
	var ymax;
	var ymin;

	if(settings.num < settings.total1)
	{
		t = settings.num/settings.total1;
		zmin = -3*Math.PI/7.0;
		zmax = Math.PI/8.0;
		ymin = -Math.PI/4.0;
		ymax = 0;
	}
	else if(settings.num < settings.total2)
	{
		t = 1 - (settings.num-settings.total1)/(settings.total2-settings.total1);
		zmin = -3*Math.PI/8.0;
		zmax = Math.PI/16.0;
		ymin = -Math.PI/8.0;
		ymax = 0;
	}
	else 
	{
		t = 1 - (settings.num-settings.total2)/(settings.total3-settings.total2);
		zmin = -Math.PI/3.0;
		zmax = 0;
		ymin = -Math.PI/16.0;
		ymax = 0;
	}

	var zb = 0.2;
	var zg = 0.3;
	var yb = 0.1;
	var yg = 0.3;
	
	var zt = gain(zg, bias(zb, t));
	var yt = gain(yg, bias(yb, t));

	var extraZ = zmin*(1-zt) + zmax*(zt);
	var extraY = ymin*(1-yt) + ymax*(yt);

	mesh.rotation.z = -Math.PI/2.0 + extraZ;
	mesh.rotation.y = 3*Math.PI/4.0 + extraY + featherOrientation*Math.PI/2.0;
	mesh.rotation.x = 0;

	var origyRot = mesh.rotation.y;
	var origzRot = mesh.rotation.z;
	var noise = findNoise(settings.num, time);
	var jitterz = Math.PI/4.0;
	var jittery = windSpeed*noise*Math.PI*windDirection/180;
	if((flapSpeed*time)%120 < 60)
	{
		var timet = ((flapSpeed*time)%120)/60;
		mesh.rotation.y = origyRot + jittery*timet;
		mesh.rotation.z = origzRot + jitterz*timet;
	} 
	else
	{
		var timet = ((flapSpeed*time)%120-60)/60;
		mesh.rotation.y = origyRot + jittery*(1-timet);
		mesh.rotation.z = origzRot + jitterz*(1-timet);
	}
}

export function getScale(mesh, settings)
{
	var t;
	var yhighVal;
	var ylowVal;
	var zhighVal;
	var zlowVal;

	if(settings.num < settings.total1)
	{
		t = 1 - (settings.num/settings.total1);
		yhighVal = 1.5*featherSize;
		ylowVal = 1;
		zhighVal = 1.5*featherSize;
		zlowVal = 1;
	}
	else if(settings.num < settings.total2)
	{
		t = (settings.num-settings.total1)/(settings.total2-settings.total1);
		yhighVal = 1*featherSize;
		ylowVal = 0.5;
		zhighVal = 1*featherSize;
		zlowVal = 0.5;
	}
	else 
	{
		t = (settings.num-settings.total2)/(settings.total3-settings.total2);
		yhighVal = 0.5*featherSize;
		ylowVal = 0.2;
		zhighVal = 0.5*featherSize;
		zlowVal = 0.25;
	}

	var zbias = 0.8;
	var zgain = 0.8;
	var ybias = 0.8;
	var ygain = 0.8;
	
	var zt = gain(zgain, bias(zbias, t));
	var yt = gain(ygain, bias(ybias, t));

	var scaleZ = zlowVal*(1-zt) + zhighVal*(zt);
	var scaleY = ylowVal*(1-yt) + yhighVal*(yt);

	mesh.scale.z = scaleZ;
	mesh.scale.x = scaleY;
}

function bias(b, t)
{
	return Math.pow(t, Math.log(b) / Math.log(0.5));
}

function gain(g, t)
{
	if(t < 0.5)
	{
		return bias(1-g, 2*t) / 2;
	}
	else
	{
		return 1 - bias(1-g, 2 - 2*t) / 2;
	}
}

function findNoise(x, y)
{
	var bigNum = Math.sin(x*12.9898 + y*78.233)*43758.5453;
	if(bigNum < 0.0){ return -1*(bigNum - Math.floor(bigNum)); }
	else { return -1*(bigNum - Math.floor(bigNum)); }
}

var funcs = {
	updateCurve: updateCurve,
	updateDistrib: updateDistrib,
	updateSize: updateSize,
	updateOrient: updateOrient,
	updateSpeed: updateSpeed,
	updateFlapSpeed: updateFlapSpeed,
	updateDir: updateDir,
	incTime: incTime,
	changeColor: changeColor,
	color: color,
	getPos: getPos,
	getRot: getRot,
	getScale: getScale,
	curvature: curvature,
	featherDistribution: featherDistribution,
	featherSize: featherSize,
	featherOrientation: featherOrientation,
	windSpeed: windSpeed,
	flapSpeed: flapSpeed,
	windDirection: windDirection
}

export default funcs;           
            