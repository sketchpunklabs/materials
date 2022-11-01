/* 
https://www.ronja-tutorials.com/post/024-white-noise/
*/
export default { packageName: 'WhiteNoise', items:{
'whiteNoise':`
float whiteNoise( vec3 value ){
    vec3 smallValue = sin( value );                                     // make value smaller to avoid artefacts
    float random    = dot( smallValue, vec3(12.9898, 78.233, 37.719) ); // get scalar value from 3d vector

    // make value more random by making it bigger and then taking the factional part
    return fract( sin( random ) * 143758.5453 );                               
}

float whiteNoise( vec3 value, vec3 dotDir ){
    vec3 smallValue = sin( value );               // make value smaller to avoid artefacts
    float random    = dot( smallValue, dotDir );  // get scalar value from 3d vector
    // make value more random by making it bigger and then taking the factional part
    return fract( sin( random ) * 143758.5453 );                               
}

float whiteNoise( vec2 value ){
    vec2 smallValue = sin (value );
    float random    = dot( smallValue, vec2( 12.9898, 78.233 ) );
    return fract( sin( random ) * 143758.5453 );
}

float whiteNoise( float value ){
    return fract( sin( value + 0.546 ) * 143758.5453 );
}

float whiteNoise( float value, float mutator ){
    return fract( sin( value + mutator ) * 143758.5453 );
}

vec3 whiteNoise3D( vec3 value ){
    return vec3(
        whiteNoise( value, vec3( 12.989, 78.233, 37.719 ) ),
        whiteNoise( value, vec3( 39.346, 11.135, 83.155 ) ),
        whiteNoise( value, vec3( 73.156, 52.235, 09.151 ) )
    );
}

vec3 whiteNoise3D( float value ){
    return vec3(
        whiteNoise( value, 3.9812 ),
        whiteNoise( value, 7.1536 ),
        whiteNoise( value, 5.7241 )
    ); 
}`,
}};