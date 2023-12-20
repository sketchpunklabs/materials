// https://github.com/blender/blender/blob/main/source/blender/gpu/shaders/common/gpu_shader_common_math.glsl

export default {

/* See: https://www.iquilezles.org/www/articles/smin/smin.htm.
    a = valueA, b = valueB, c = distance */
'SmoothMin':`float math_smoothmin( float a, float b, float c ){
    if (c != 0.0) {
      float h = max(c - abs(a - b), 0.0) / c;
      return min( a, b ) - h * h * h * c * (1.0 / 6.0);
    } else return min( a, b );
  }`,

};