export const fragmentShaderSrc = `
precision mediump float;
    
in vec2 vUv;

out vec4 o_fragColor;


void main() {
    vec3 color = vec3(.41, 1.0, .5);
    float clarity = (vUv.y * .5) + .5;

    o_fragColor = vec4(color * clarity, 1.0);
}
`;
