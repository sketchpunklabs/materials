/* 
https://www.shadertoy.com/view/ltB3zD
Gold Noise ©2015 dcerisano@standard3d.com
- based on the Golden Ratio
- uniform normalized distribution
- fastest static noise generator function (also runs at low precision)
- use with indicated seeding method
*/
export default `float goldNoise(in vec2 xy){ return fract(tan(distance(xy*1.61803398874989484820459, xy))*xy.x); }`;