# [Project2: Toolbox Functions](https://github.com/CIS700-Procedural-Graphics/Project2-Toolbox-Functions)

## Overview

The objective of this assignment is to procedurally model and animate a bird wing. Let's get creative!

Start by forking and then cloning [this repository](https://github.com/CIS700-Procedural-Graphics/Project2-Toolbox-Functions)

## Modeling

Modelling the Shape of a wing procedurally using mathametical equations. First modeling the curve of the wing using Catmull Rom spline. Then instancing a feather geometry across the spline creatinging the basic structure of the wing, many different types of feather geometry can be instanced to sample multiple types of feathers. 


## Animation

The wind force is reflected as the jittering motion of the wings, the speed of the wind determines the jitter rate. Wing flapping is achived by applying a basic sin function to the Y component of the feathers position.  

## Interactivity

Using Dat.GUI and the examples provided in the reference code, allow the user to adjust the following controls:

1. The curvature of the wing's basic shape
2. Feather distribution - In Later Implementations
3. Feather size
4. Feather color - In Later Implementations
5. Feather orientation
6. Flapping speed
7. Flapping motion
