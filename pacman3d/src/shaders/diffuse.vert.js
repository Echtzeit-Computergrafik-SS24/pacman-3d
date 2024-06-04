export const vertexShaderSrc = `
precision highp float;

out vec3 f_normal;
out vec3 f_worldPos;
out vec2 f_texCoord;
out mat3 f_TBN;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    f_worldPos = worldPos.xyz;
    f_normal = (modelMatrix * vec4(normal, 0.0)).xyz;
    f_texCoord = uv;

    // TBN Matrix
    #ifdef USE_TANGENT
        vec3 T = normalize(vec3(modelMatrix * vec4(tangent, 0.0)));
        vec3 N = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
        vec3 B = cross(N, T);
        f_TBN = mat3(T, B, N);
    #endif

    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;
