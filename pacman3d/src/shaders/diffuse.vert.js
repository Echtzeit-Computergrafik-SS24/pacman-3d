export const vertexShaderSrc = `
precision highp float;

out vec3 f_normal;
out vec3 f_worldPos;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    f_worldPos = worldPos.xyz;
    f_normal = (modelMatrix * vec4(normal, 0.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;
