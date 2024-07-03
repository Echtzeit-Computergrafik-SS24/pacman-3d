export const fragmentShaderSrc = `
precision mediump float;

out vec4 o_fragColor;

vec4 packDepthToRGBA( const in float v );

const float ShiftRight8 = 1. / 256.;
const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );

vec4 packDepthToRGBA( const in float v ) {
    vec4 r = vec4( fract( v * PackFactors ), v );
    r.yzw -= r.xyz * ShiftRight8; // tidy overflow
    return r * PackUpscale;
}

void main() {
    o_fragColor = packDepthToRGBA(gl_FragCoord.z);
}
`;
