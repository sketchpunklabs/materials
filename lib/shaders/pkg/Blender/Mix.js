// https://github.com/blender/blender/blob/main/source/blender/gpu/shaders/material/gpu_shader_material_mix_color.glsl

export default {

'LinearLight':`vec4 node_mix_linear(float fac, vec4 col1, vec4 col2){
  return col1 + fac * (2.0 * (col2 - vec4(0.5)));
}`,

};