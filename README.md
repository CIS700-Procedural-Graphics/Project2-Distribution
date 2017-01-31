# [Project2: Toolbox Functions](https://github.com/CIS700-Procedural-Graphics/Project2-Toolbox-Functions)

Find the final product at: https://tabathah.github.io/Project2-Toolbox-Functions/

## Overview

I procedurally created an animated wing of a parrot.

Here are some reference images I started out with:

![](./references/parrot01.jpg)

![](./references/parrot02.jpg)

![](./references/parrot03.jpg)

## Model

I was given this basic model of a feather:

![](./progressShots/original-feather.PNG)

The first thing I did was create a curve that would outline the basic shape of the wing. Here is my curve displayed as a tube geometry so I could see and work on it:

![](./progressShots/curve.PNG)

The next thing I did was evenly distribute feathers along the positions on the curve:

![](./progressShots/placed-feathers-on-curve.PNG)

I then began scaling the feathers. To do this, I simply interpolated between the size I wanted the left most feather to have and the size I wanted the right most feather to have. To make this more realistic, I incorporated bias and gain to make the transition less linear. The bias on the scale favored the left feathers so that the left most feathers would be noticably larger than the rest. Also, the gain favored the middle of the feather distribution, so there would be many feathers of the same size in the middle. The result was the following:

![](./progressShots/with-scale-distribution.PNG)

After doing this, I realized I wanted three layers of feathers on my wing to provide added realism. I made two more layers of feathers, displacing there depth by a bit to separate them from other layers, with limited positions on the wing curve and different ranges of scale from the first layer. This gave the following result:

![](./progressShots/layers-added.PNG)

The last thing to do in the modeling was to interpolate rotation of the feathers. The left most feathers had a sharp angle to the left in comparison to the rest and the right most feathers had a slight angle to the right. I provided similar bias and gain in this interpolation to the scaling one because again I wanted the left-most feathers to stand out from the rest and I wanted the middle ones to be pretty uniform. This addition provided the following result:

![](./progressShots/rotation-added.PNG)

Finally, I added color to the feathers. I created my own shaders which took into account the index of each feather for interpolating and deciding on color based on layer, as well as the light position in the scene and an integer indicating the color pallete. First I started with a flat shader, that merely chose color based on the layer the feather was on. 

![](./progressShots/color-added.PNG)

I then added lamertian shading and iridescence, as well as changing the colors I was interpolating in order to make the colors more realistic.

![](./progressShots/improved-color-with-lambert-and-iridescence.PNG)

## Animation

I animated the wing so that it would flap at a certain speed and so that the feathers would be affected by a theoretical wind with a speed and a direction. 

The flapping part of the animation was simply a rotation about the x-axis that is linearly interpolated to create the continuous motion. 

I applied the wind by adding a rotation to each feather that was based on the angle of the wind direction and a simple pseudo-noise value based on the feather's index. This noise value was limited based on the speed of the wind, where low speed caused the noise to be very limited and high speed caused the noise to be unlimited. The following is a shot of the wing while high wind speed is on and feathers are being displaced.

![](./progressShots/wind-displacement.PNG)  

## Interactivity

I added several sliders on the GUI to change the parameters of the wing for this project. Some pictures have been added for particularly interesting changes that can occur. 

The curvature one affects the y positions of the original curve the wing is based on, so that increasing curvature creates a bendy wing and decreasing it make the wing more flat.

![](./progressShots/high-curvature.PNG) 

![](./progressShots/low-curvature.PNG)

The feather distribution one affects the bias of the position interpolation, so that the more it varies from 0.5, the more the featehrs shift to one side or the other. 

Feather size affects the scale of the feathers in a fairly straightforawrd way. 

![](./progressShots/high-feather-size.PNG) 

![](./progressShots/low-feather-size.PNG)

Feather orientation affects the angle of the feathers, again in a pretty strightforward way. 

If the color slider is less than 1.5, the color palette is the default red, yellow, blue, whereas if its over 1.5, the color palette is a purple, blue, and turquoise palette. Below is the second color palette.

![](./progressShots/second-color-palette.PNG) 

Wind speed affects the amount of noise that can be placed on feathers during the wind animation, so higher speed creates a more violent wind displacement, and lower speed creates soft vibrations.

Flap Speed affects the period of time during which one up and down motion of the wind occurs. 

Finally, wind direction affects the angle on which the wind is blowing, where 0 is coming straight down onto the wing, 90 is blowing from the right side of the screen, and -90 is blowing from the left side of the screen.
