/*
seed           Seed for PRNG generation.
persistance    Factor by which successive layers of noise will decrease in amplitude. ( 0.5, 0.01 > 2 )
lacunarity     Factor by which successive layers of noise will increase in frequency. ( 2, 0.1 > 4 )
scale          "Zoom level" of generated noise. ( 1, 0.01 > 5 )
redistribution Flatness in the generated noise. ( 1, 0.1 > 5 )
octaves        Number of layers of noise to stack. ( 7, 1 > 10 )
terbulance     Enable terbulance
ridge          Convert the fBm to Ridge Noise. Only works when "terbulance" is set to true.

fbmOptions opts = fbmOptions( 0.0, 0.3, 2.0, 0.5, 1.0, 3, false, false );
*/

export default { packageName: 'Simplex2D', items:{
'fbmOptions':`
struct fbmOptions {
    float   seed;
    float   persistance;
    float   lacunarity;
    float   scale;
    float   redistribution;
    int     octaves;
    bool    terbulance;
    bool    ridge;
};`,

'simplex':`
vec3 simplex_rand3(vec3 p) { return mod(((p * 34.0) + 1.0) * p, 289.0); }
float simplex( vec2 v ){
    const vec4 C = vec4( 0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;

    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);

    vec3 p = simplex_rand3(simplex_rand3(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}`,

'simplex_fbm':`
float simplex_fbm( vec2 v, fbmOptions opts ){
    float persistance       = opts.persistance;
    float lacunarity        = opts.lacunarity;
    float redistribution    = opts.redistribution;
    int octaves             = opts.octaves;
    bool terbulance         = opts.terbulance;
    bool ridge              = opts.terbulance && opts.ridge;
    
    float result            = 0.0;
    float amplitude         = 1.0;
    float frequency         = 1.0;
    float maximum           = amplitude;

    v += ( opts.seed * 100.0 );

    for( int i = 0; i < 10; i++ ){
        if( i >= octaves ) break;

        vec2 p            = v * frequency * opts.scale;
        float noiseVal    = simplex(p);

        if( terbulance ) noiseVal = abs( noiseVal );
        if( ridge )      noiseVal = -1.0 * noiseVal;

        result    += noiseVal * amplitude;
        frequency *= lacunarity;
        amplitude *= persistance;
        maximum   += amplitude;
    }

    float redistributed = pow( result, redistribution );
    return redistributed / maximum;
}`,
}};