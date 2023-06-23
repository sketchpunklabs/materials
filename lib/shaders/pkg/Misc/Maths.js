vec3 decomposeScaleFromMat4( mat4 m ){
    return vec3(
        length( vec3( m[0][0], m[0][1], m[0][2] ) ),
        length( vec3( m[1][0], m[1][1], m[1][2] ) ),
        length( vec3( m[2][0], m[2][1], m[2][2] ) )
    );
}

mat3 decomposeRotFromMat4( mat4 m ){
    vec3 s = 1.0 / decomposeScaleFromMat4( m ); // Invert to make it a mul op
    return mat3( 
        m[0][0] * s.x, m[0][1] * s.x, m[0][2] * s.x,
        m[1][0] * s.y, m[1][1] * s.y, m[1][2] * s.y,
        m[2][0] * s.z, m[2][1] * s.z, m[2][2] * s.z
    );
}

vec3 axisAngle( vec3 pos, vec3 axis, float degs ){
    // Rodrigues Rotation formula:
    // v_rot = v * cos(theta) + cross( axis, v ) * sin(theta) + axis * dot( axis, v) * (1-cos(theta))

    vec3 cp   = cross( pos, axis ); //cross( axis, pos );
    float d   = dot( axis, pos );
    float rad = degs * DEG2RAD;
    float s   = sin( rad );
    float c   = cos( rad );
    float ci  = 1.0 - c;

    return pos * c + cp * s + axis * d * ci;
}

vec3 vec3RotX( vec3 v, float deg ){
    float rad = deg * 0.01745329251;
    float c   = cos( rad );
    float s   = sin( rad );
    return vec3( 
        v.x,
        v.y * c - v.z * s,
        v.y * s + v.z * c
    );
}

vec3 vec3RotY( vec3 v, float deg ){
    float rad = deg * 0.01745329251;
    float c   = cos( rad );
    float s   = sin( rad );
    return vec3( 
        v.z * s + v.x * c,
        v.y,
        v.z * c - v.x * s
    );
}

vec3 vec3RotZ( vec3 v, float deg ){
    float rad = deg * 0.01745329251;
    float c   = cos( rad );
    float s   = sin( rad );
    return vec3( 
        v.x * c - v.y * s,
        v.x * s + v.y * c,
        v.z
    );
}

// Sphere warps UV coordinates
// https://www.patreon.com/posts/resource-orb-urp-73860779
// https://docs.unity3d.com/Packages/com.unity.shadergraph@6.9/manual/Spherize-Node.html
// void Unity_Spherize_float(float2 UV, float2 Center, float Strength, float2 Offset, out float2 Out)
// {
//     float2 delta = UV - Center;
//     float delta2 = dot(delta.xy, delta.xy);
//     float delta4 = delta2 * delta2;
//     float2 delta_offset = delta4 * Strength;
//     Out = UV + delta * delta_offset + Offset;
// }

// https://docs.unity3d.com/Packages/com.unity.shadergraph@6.9/manual/Rotate-About-Axis-Node.html
// // axis should be normalized
// vec3 Unity_RotateAboutAxis_Degrees( vec3 pos, vec3 axis, float degs ){
//     float rads  = degs * DEG2RAD;
//     float s  = sin( rads );
//     float c  = cos( rads );
//     float ci = 1.0 - c;

//     mat3x3 rot = mat3x3(
//         ci * axis.x * axis.x + c, 
//         ci * axis.x * axis.y - axis.z * s, 
//         ci * axis.z * axis.x + axis.y * s,

//         ci * axis.x * axis.y + axis.z * s, 
//         ci * axis.y * axis.y + c, 
//         ci * axis.y * axis.z - axis.x * s,
        
//         ci * axis.z * axis.x - axis.y * s, 
//         ci * axis.y * axis.z + axis.x * s, 
//         ci * axis.z * axis.z + c
//     );

//     return rot * pos;
// }

const float DEG2RAD = 0.01745329251; // PI / 180


// YXZ rotation, but apply it backwards
void eulerRotation( vec3 rot, inout vec3 pos, inout vec3 norm ){
    float s;
    float c;
    vec3  v;

    if( rot.z != 0.0 ){
      c     = cos( rot.z );
      s     = sin( rot.z );
      v     = pos;
      pos.x = v.x * c - v.y * s;
      pos.y = v.x * s + v.y * c;

      v      = norm;
      norm.x = v.x * c - v.y * s;
      norm.y = v.x * s + v.y * c;
    }

    if( rot.x != 0.0 ){
      c     = cos( rot.x );
      s     = sin( rot.x );
      v     = pos;
      pos.y = v.y * c - v.z * s;
      pos.z = v.y * s + v.z * c;

      v      = norm;
      norm.y = v.y * c - v.z * s;
      norm.z = v.y * s + v.z * c;
    }

    if( rot.y != 0.0 ){
      c    = cos( rot.y );
      s    = sin( rot.y );
      v    = pos;
      pos.x = v.z * s + v.x * c;
      pos.z = v.z * c - v.x * s;

      v    = norm;
      norm.x = v.z * s + v.x * c;
      norm.z = v.z * c - v.x * s;
    }
}