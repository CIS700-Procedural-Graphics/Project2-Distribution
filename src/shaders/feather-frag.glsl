uniform float layer;
uniform vec3 light;
uniform float colorType;
varying vec3 norm;
varying vec3 pos;

void main() {

  vec3 basecolor;

  //need to round colorType up or down to 1 or 2
  int cType;
  if(colorType < 1.5){ cType = 1; }
  else{ cType = 2; }

  //all the colors that might be used in the wing
  vec3 lightBlue = vec3((15.0/255.0), (132.0/255.0), 1.0);
  vec3 darkBlue = vec3((37.0/255.0), (73.0/255.0), 1.0);
  vec3 indigo = vec3((75.0/255.0), (25.0/255.0), (226.0/255.0));
  vec3 lightIndigo = vec3((79.0/255.0), (79.0/255.0), (222.0/255.0));
  vec3 yellow = vec3(1.0, (213.0/255.0), 0.0);
  vec3 blueTurq = vec3((43.0/255.0), (187.0/255.0), (223.0/255.0));
  vec3 greenTurq = vec3((29.0/255.0), (223.0/255.0), (210.0/255.0));
  vec3 red = vec3((236.0/255.0), (67.0/255.0), (41.0/255.0));
  vec3 darkRed = vec3((202.0/255.0), (34.0/255.0), 0.0);

  //interpolating based on feather number, color pallete given, layer the feather is on
  if(layer < 45.0)
  {
 	  float t = layer/45.0;

      if(cType == 1)
      {
          basecolor = (1.0-t)*darkBlue + t*lightBlue;
      }
      else
      {
          basecolor = (1.0-t)*indigo + t*lightIndigo;
      }
  	  
  }
  else if(layer < 75.0)
  {
  	  float t = (layer-45.0)/30.0;

      if(cType == 1)
      {
          basecolor = (1.0-t)*yellow + t*lightBlue;
      }
      else
      {
          basecolor = (1.0-t)*blueTurq + t*lightBlue;
      }
  }
  else
  {
      float t = (layer-75.0)/25.0;

      if(cType == 1)
      {
          basecolor = (1.0-t)*darkRed + t*red;
      }
      else
      {
          basecolor = (1.0-t)*blueTurq + t*greenTurq;
      }
  }

  //lambertian shading calculation
  vec3 lightDir = pos - vec3(0.0, 1.0, 0.0);
  float lambert = clamp(dot(norm, normalize(lightDir)), 0.0, 1.0);

  //iridescence calculated as dot between z vector and camera position relative to this fragment
  vec3 camDir = pos - cameraPosition;
  float iridescence = 2.0*clamp(dot(vec3(0.0, 0.0, -1.0), normalize(camDir)), 0.5, 1.0);

  vec3 color = iridescence*lambert*basecolor;

  gl_FragColor = vec4( color.rgb, 1.0 );

}