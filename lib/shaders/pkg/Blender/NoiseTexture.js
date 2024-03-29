// https://github.com/blender/blender/blob/main/source/blender/gpu/shaders/material/gpu_shader_material_tex_noise.glsl

// Requires CommonHash, Noise and FractalNoise

export default {

'NoiseTexture':`
float random_float_offset(float seed){ return 100.0 + hash_float_to_float(seed) * 100.0; }

vec2 random_vec2_offset(float seed){
  return vec2(100.0 + hash_vec2_to_float(vec2(seed, 0.0)) * 100.0,
              100.0 + hash_vec2_to_float(vec2(seed, 1.0)) * 100.0);
}

vec3 random_vec3_offset(float seed){
  return vec3(100.0 + hash_vec2_to_float(vec2(seed, 0.0)) * 100.0,
              100.0 + hash_vec2_to_float(vec2(seed, 1.0)) * 100.0,
              100.0 + hash_vec2_to_float(vec2(seed, 2.0)) * 100.0);
}

vec4 random_vec4_offset(float seed){
  return vec4(100.0 + hash_vec2_to_float(vec2(seed, 0.0)) * 100.0,
              100.0 + hash_vec2_to_float(vec2(seed, 1.0)) * 100.0,
              100.0 + hash_vec2_to_float(vec2(seed, 2.0)) * 100.0,
              100.0 + hash_vec2_to_float(vec2(seed, 3.0)) * 100.0);
}

void node_noise_texture_1d(vec3 co,
                           float w,
                           float scale,
                           float detail,
                           float roughness,
                           float distortion,
                           out float value,
                           out vec4 color){
  float p = w * scale;
  if (distortion != 0.0) {
    p += snoise(p + random_float_offset(0.0)) * distortion;
  }

  value = fractal_noise(p, detail, roughness);
  color = vec4(value,
               fractal_noise(p + random_float_offset(1.0), detail, roughness),
               fractal_noise(p + random_float_offset(2.0), detail, roughness),
               1.0);
}

void node_noise_texture_2d(vec3 co,
                           float w,
                           float scale,
                           float detail,
                           float roughness,
                           float distortion,
                           out float value,
                           out vec4 color){
  vec2 p = co.xy * scale;
  if (distortion != 0.0) {
    p += vec2(snoise(p + random_vec2_offset(0.0)) * distortion,
              snoise(p + random_vec2_offset(1.0)) * distortion);
  }

  value = fractal_noise(p, detail, roughness);
  color = vec4(value,
               fractal_noise(p + random_vec2_offset(2.0), detail, roughness),
               fractal_noise(p + random_vec2_offset(3.0), detail, roughness),
               1.0);
}

// MODIFIED VERSION OF node_noise_texture_2d
float node_noise_texture_2d_mod( vec2 co, float scale, float detail, float roughness, float distortion ){
    vec2 p = co * scale;
    if (distortion != 0.0) {
        p += vec2(snoise(p + random_vec2_offset(0.0)) * distortion,
        snoise(p + random_vec2_offset(1.0)) * distortion);
    }

    return fractal_noise( p, detail, roughness );
}

void node_noise_texture_3d(vec3 co,
                           float w,
                           float scale,
                           float detail,
                           float roughness,
                           float distortion,
                           out float value,
                           out vec4 color){
  vec3 p = co * scale;
  if (distortion != 0.0) {
    p += vec3(snoise(p + random_vec3_offset(0.0)) * distortion,
              snoise(p + random_vec3_offset(1.0)) * distortion,
              snoise(p + random_vec3_offset(2.0)) * distortion);
  }

  value = fractal_noise(p, detail, roughness);
  color = vec4(value,
               fractal_noise(p + random_vec3_offset(3.0), detail, roughness),
               fractal_noise(p + random_vec3_offset(4.0), detail, roughness),
               1.0);
}

void node_noise_texture_4d(vec3 co,
                           float w,
                           float scale,
                           float detail,
                           float roughness,
                           float distortion,
                           out float value,
                           out vec4 color){
  vec4 p = vec4(co, w) * scale;
  if (distortion != 0.0) {
    p += vec4(snoise(p + random_vec4_offset(0.0)) * distortion,
              snoise(p + random_vec4_offset(1.0)) * distortion,
              snoise(p + random_vec4_offset(2.0)) * distortion,
              snoise(p + random_vec4_offset(3.0)) * distortion);
  }

  value = fractal_noise(p, detail, roughness);
  color = vec4(value,
               fractal_noise(p + random_vec4_offset(4.0), detail, roughness),
               fractal_noise(p + random_vec4_offset(5.0), detail, roughness),
               1.0);
}
`,

};