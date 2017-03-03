# Procedural Wing

## Project Description

### Overall description

The project goes about creating the wing of a bird, albeit perhaps not the most detailed model.
Various GUI controls were added to give the project more life.

GUI controls let you:

1. Change the colors of the feathers of the wing

2. Change the strength and direction of wind, which is seen as a small perturbarance

3. Change the flapping speed of the wing

4. Change the control points of the spline that determines the wing shape

5. Change various aspects of the feathers on the wing: the number of feathers, how they're distributed,
their orientation, and their size

6. Change the field of view of the camera

The UVs are updated constantly to make the surface of the sphere seem animated.

### Things Done:

#### main.js description

1. Created a spline curve using four control points, which defines the high level look of a birds wing.

2. I then generated a bunch of feathers at various points along the curve.

3. The feather_Material shader contains a uniform that allows us to dynamically change the color of the feathers.

4. The GUI parameters are all applied to  control aspects of feather generation and wing shape determination. This necessitates
that atleast a few, such as number of feahers, result in the removal of all objects from the scene and overall feather group, to be added again with new properties.

5. All the GUI parameters updated to create a dynamic looking scene in 'function onUpdate(framework)'

#### Shaders

##### Fragment Shader

1. The fragment shader utilizes the uniform color passed in to color in fragments
