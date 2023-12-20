// https://github.com/blender/blender/blob/main/source/blender/gpu/shaders/material/gpu_shader_material_vector_rotate.glsl

export default {

'YAxis':`vec3 node_vector_rotate_axis_y( vec3 vector_in, vec3 center, float angle, float invert ){
    return rotate_around_axis(vector_in - center, vec3(0.0, 1.0, 0.0), angle * invert) + center;
}`,

'ZAxis': `vec3 node_vector_rotate_axis_z( vec3 vector_in, vec3 center, float angle, float invert ){
    return rotate_around_axis(vector_in - center, vec3(0.0, 0.0, 1.0), angle * invert) + center;
}`,

'AroundAxis':`vec3 rotate_around_axis( vec3 p, vec3 axis, float angle ){
    float costheta = cos(angle);
    float sintheta = sin(angle);
    vec3 r;

    r.x = ((costheta + (1.0 - costheta) * axis.x * axis.x) * p.x) +
          (((1.0 - costheta) * axis.x * axis.y - axis.z * sintheta) * p.y) +
          (((1.0 - costheta) * axis.x * axis.z + axis.y * sintheta) * p.z);

    r.y = (((1.0 - costheta) * axis.x * axis.y + axis.z * sintheta) * p.x) +
          ((costheta + (1.0 - costheta) * axis.y * axis.y) * p.y) +
          (((1.0 - costheta) * axis.y * axis.z - axis.x * sintheta) * p.z);

    r.z = (((1.0 - costheta) * axis.x * axis.z - axis.y * sintheta) * p.x) +
          (((1.0 - costheta) * axis.y * axis.z + axis.x * sintheta) * p.y) +
          ((costheta + (1.0 - costheta) * axis.z * axis.z) * p.z);

    return r;
}`,

};