export const fragmentShaderSrc = `
precision mediump float;

uniform samplerCube u_skybox;

in vec3 f_texCoord;

out vec4 o_fragColor;


void main() {
    o_fragColor = texture(u_skybox, f_texCoord);
}
`;
