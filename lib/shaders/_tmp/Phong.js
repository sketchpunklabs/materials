export default { packageName: 'Phong', items:{

'Light':`
struct Light{
    vec3  position;
    vec3  color;     // 0xffc868
    vec3  ambient;
    float falloff;   // 0.14
    float radius;    // 20
};`,

'Material':`
struct Material{
    float specularStrength; // 1.0
    float specularScale;    // 0.65;
    float shininess;        // 0.0;
    float roughness;        // 1.0;
    float albedo;           // 1.0;
};`,

'lowPolyNormal':`
vec3 lowPolyNormal( vec3 p ){ return normalize( cross( dFdx(p), dFdy(p) ) ); }`,

'attenuation':`
float attenuation( float r, float f, float d ){
    float denom         = d / r + 1.0;
    float attenuation   = 1.0 / (denom * denom);
    float t             = (attenuation - f) / (1.0 - f);
    return max( t, 0.0 );
}`,

'computeDiffuse':`
float computeDiffuse( vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, float roughness, float albedo ){
    float LdotV  = dot( lightDirection, viewDirection );
    float NdotL  = dot( lightDirection, surfaceNormal );
    float NdotV  = dot( surfaceNormal, viewDirection );

    float s      = LdotV - NdotL * NdotV;
    float t      = mix(1.0, max(NdotL, NdotV), step(0.0, s));

    float sigma2 = roughness * roughness;
    float A      = 1.0 + sigma2 * (albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
    float B      = 0.45 * sigma2 / (sigma2 + 0.09);

    return albedo * max(0.0, NdotL) * (A + B * s / t) / 3.14159265;
}`,

'computeSpecular':`
float computeSpecular( vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, float shininess ){
    vec3 R = -reflect( lightDirection, surfaceNormal );
    return pow( max(0.0, dot(viewDirection, R)), shininess ); // Calculate Phong power
}`,

'calcLight':`
vec3 calcLight( Light light, Material mat, vec3 N, vec3 fragPos, vec3 diffuseColor ){  
    // determine perturbed surface normal
    vec3 V              = normalize( fragPos );
    vec3 lightVector    = light.position - fragPos;
  
    // calculate attenuation
    float lightDistance = length( lightVector );
    float falloff       = attenuation( light.radius, light.falloff, lightDistance );
  
    // light direction
    vec3 L = normalize( lightVector );
  
    // diffuse term
    vec3 diffuse        = light.color * computeDiffuse( L, V, N, mat.roughness, mat.albedo ) * falloff;
    float specular      = mat.specularStrength * computeSpecular( L, V, N, mat.shininess );
    specular           *= mat.specularScale;
    specular           *= falloff;
  
    return diffuseColor * ( diffuse + light.ambient ) + specular;
    // return mix( diffuseColor * ( diffuse + light.ambient ), light.color, specular );
  }`,
}};