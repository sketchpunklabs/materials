export default {

'rotateUV':`
vec2 rotateUV( vec2 uv, float rot ){
    float mid = 0.5;
    float c   = cos( rot );
    float s   = sin( rot );
    return vec2(
        c * (uv.x - mid) + s * (uv.y - mid) + mid,
        c * (uv.y - mid) - s * (uv.x - mid) + mid
    );
}`,

};

