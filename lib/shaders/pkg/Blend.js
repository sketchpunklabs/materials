export default { packageName: 'Blend', items:{

/* The Soft Light blend mode creates a subtle lighter or darker result depending on the brightness of the foreground
color. Blend colors that are more than 50% brightness will lighten the background pixels and colors that are less 
than 50% brightness will darken the background pixels. */
'softLight':`
float blend_softLight(float f, float b) {
    return (f < 0.5)
            ? b - (1.0 - 2.0 * f) * b * (1.0 - b)
            : (b < 0.25)
                    ? b + (2.0 * f - 1.0) * b * ((16.0 * b - 12.0) * b + 3.0)
                    : b + (2.0 * f - 1.0) * (sqrt(b) - b);
}
vec4 blend_softLight(vec4 f, vec4 b) {
    return vec4(
        blend_softLight(f.x, b.x),
        blend_softLight(f.y, b.y),
        blend_softLight(f.z, b.z),
        blend_softLight(f.a, b.a)
    );
}`,

// With Screen blend mode the values of the pixels in the two inputs are inverted, multiplied, and then inverted again.
// The result is the opposite effect to multiply and is always equal or higher (brighter) compared to the original.
'screen':`
vec4 blend_screen( vec4 f, vec4 b ){ return 1.0 - (1.0 - f) * (1.0 - b); }`,

// The Overlay blending mode combines Multiply and Screen blend modes:
// - If the value of the lower layer pixel is below 0.5, then a Multiply type blending is applied. 
// - If the value of the lower layer pixel is above 0.5, then a Screen type blending is applied.
'overlay':`
float blend_overlay( float f, float b ) {
    return (b < 0.5) ? 2.0 * f * b : 1.0 - 2.0 * (1.0 - f) * (1.0 - b);
}
vec4 blend_overlay( vec4 f, vec4 b ){
    return vec4(
        blend_overlay(f.x, b.x),
        blend_overlay(f.y, b.y),
        blend_overlay(f.z, b.z),
        blend_overlay(f.a, b.a)
    );
}`,

// The Divide blending mode will divide the background input pixels value by each corresponding pixel in the foreground.
'divide':`vec4 blend_divide( vec4 f, vec4 b ) { return b / f; }`,

'switch':`vec4 blend_switch( vec4 f, vec4 b, float o ){ return max( (f * o), (b * (1.0 - o)) ); }`,

// The Darken (Min) Blending mode will pick the lower value between the background and the foreground.
'darken':`vec4 blend_darken( vec4 f, vec4 b ){ return min( f, b ); }`,

// The Lighten (Max) Blending mode will pick the higher value between the background and the foreground.
'lighten':`vec4 blend_lighten( vec4 f, vec4 b ){ return max(f, b); }`,

// The Add Sub blending mode works as following:
// - Foreground pixels with a value higher than 0.5 are added to their respective background pixels. 
// - Foreground pixels with a value lower than 0.5 are substracted from their respective background pixels.
'addSub':`float blend_addSub( float f, float b ){ return f > 0.5 ? f + b : b - f; }
vec4 blend_addSub( vec4 f, vec4 b ){
  return vec4(
    blend_addSub(f.r, b.r),
    blend_addSub(f.g, b.g),
    blend_addSub(f.b, b.b),
    blend_addSub(f.a, b.a)
  );
}`,

// The Multiple blending mode will multiply the background input value by each corresponding pixel in the foreground.
'multiply':`
vec4 blend_multiply( vec4 f, vec4 b ){
    vec4 result = f * b ;
    result.a = f.a + b.a * (1.0 - f.a);
    return result;
}`,

// The Substract blending mode will substract the foreground input value from each corresponding pixel in the background.
'subtract':`
vec4 gln_subtract( vec4 f, vec4 b ){
    vec4 result = b - f;
    result.a = f.a + b.a * (1.0 - f.a);
    return result;
}`,

// The Add blending mode will add the foreground input value to each corresponding pixel in the background.
'add':`
vec4 blend_add( vec4 f, vec4 b ){
    vec4 result = vec4(f + b);
    result.a = f.a + b.a * (1.0 - f.a);
    return result;
}`,

// The Copy blending mode will just place the foreground on top of the background.
'copy':`
vec4 blend_copy( vec4 f, vec4 b ){
    vec4 result = vec4(0.0);
    result.a    = f.a + b.a * (1.0 - f.a);
    result.rgb  = ((f.rgb * f.a) + (b.rgb * b.a) * (1.0 - f.a));
    return result;
}`,

}};