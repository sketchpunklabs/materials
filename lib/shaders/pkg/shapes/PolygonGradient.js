/* 
// Licensed under the Unity Companion Package License v1.0
// https://docs.unity3d.com/Packages/com.unity.shadergraph@7.1/license/LICENSE.html
*/
export default `
float polygonGradient( vec2 UV, float Sides, float w, float h ){
    float cPi_Side  = cos( 3.141592653589793 / Sides );
	vec2 uv         = ( UV * 2.0 - 1.0 ) /
                      vec2( w  * cPi_Side, h * cPi_Side );
	uv.y *= -1.0;

	float pCoord    = atan( uv.x, uv.y );
	float r         = 6.283185307179586 / Sides;
	float distance  = cos( floor( 0.5 + pCoord / r ) * r - pCoord ) * length( uv );
	return 1.0 - distance;
}`;