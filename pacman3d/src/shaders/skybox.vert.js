export const vertexShaderSrc = `
precision highp float;



out vec3 f_texCoord;


void main() {
    f_texCoord = vec3(1, -1, -1) * position;

    vec4 ndcPos = projectionMatrix * viewMatrix * vec4(position, 0.0);
    gl_Position = ndcPos.xyww;
}
`;