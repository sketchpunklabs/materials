// https://github.com/blender/blender/blob/main/source/blender/gpu/shaders/material/gpu_shader_material_map_range.glsl

export default {

'FLinear':`float map_range_linear( float value, float fromMin, float fromMax, float toMin, float toMax ){
  return ( fromMax != fromMin )
    ? toMin + ( ( value - fromMin ) / ( fromMax - fromMin ) ) * ( toMax - toMin )
    : 0.0;
}`,

'FSmoothStep':`
float map_smootherstep( float edge0, float edge1, float x ){
  x = clamp( ( x - edge0 ) / ( edge1 - edge0 ), 0.0, 1.0 );
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

float map_range_smootherstep( float value, float fromMin, float fromMax, float toMin, float toMax ){
  if( fromMax != fromMin ){
    float factor = ( fromMin > fromMax )
      ? 1.0 - map_smootherstep( fromMax, fromMin, value ) 
      : map_smootherstep( fromMin, fromMax, value );
    return toMin + factor * ( toMax - toMin );
  }
  return 0.0;
}`,

};