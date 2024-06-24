export const vertexShaderSrc = `
precision highp float;

uniform vec3 u_lightPosition;


out vec3 f_normal;
out vec3 f_worldPos;
out vec3 f_lightPos;
out vec3 f_viewPos;
out vec2 f_texCoord;


void main() {
    f_texCoord = uv;
    vec3 _normal = (modelMatrix * vec4(normal, 0.0)).xyz;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

#ifdef USE_TANGENT
    vec3 _tangent = (modelMatrix * vec4(tangent.xyz, 0)).xyz;
    vec3 _bitangent = cross(_normal, _tangent);
    mat3 worldToTangent = transpose(mat3(_tangent, _bitangent, _normal));

    f_worldPos = worldToTangent * worldPosition.xyz;
    f_lightPos = worldToTangent * u_lightPosition;
    f_viewPos = worldToTangent * cameraPosition;
    f_normal = worldToTangent * _normal;

#else
    f_worldPos = worldPosition.xyz;
    f_normal = _normal;
    f_viewPos = cameraPosition;
    f_lightPos = u_lightPosition;

#endif

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;
