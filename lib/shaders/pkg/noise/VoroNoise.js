/* 
https://iquilezles.org/www/articles/voronoise/voronoise.htm
https://www.shadertoy.com/view/Xd23Dh

u=0, v=0: Cell Noise ( Cube )
u=0, v=1: Noise
u=1, v=0: Voronoi
u=1, v=1: Voronoise

*/
export default { packageName: 'VoroNoise', items:{
'voroNoise':`
vec3 hash3( vec2 p ){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
				   dot(p,vec2(269.5,183.3)), 
				   dot(p,vec2(419.2,371.9)) );
	return fract(sin(q)*43758.5453);
}
float voroNoise( in vec2 p, float u, float v ){
	float k = 1.0 + 63.0 * pow( 1.0 - v, 6.0);
    vec2 i  = floor( p );
    vec2 f  = fract( p );
	vec2 a  = vec2( 0.0, 0.0 );

    for( int y =- 2; y <= 2; y++ ){
        for( int x =- 2; x <= 2; x++ ){
            vec2  g = vec2( x, y );
            vec3  o = hash3( i + g ) * vec3( u, u, 1.0 );
            vec2  d = g - f + o.xy;
            float w = pow( 1.0 - smoothstep( 0.0, 1.414, length( d ) ), k );
            a      += vec2( o.z * w, w );
        }
    }
    return a.x / a.y;
}`,
}};