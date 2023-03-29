// Quat * Vec3 - Rotates Vec3
vec3 q_mul_vec( vec4 q, vec3 v ){
    //return v + cross( 2.0 * q.xyz, cross( q.xyz, v) + q.w * v );  // Either Seems to Work, not sure which is the correct way to handle transformation
    return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
} 