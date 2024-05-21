export const vertexShaderSrc = `
precision highp float;

#define M_PI 3.14159

uniform float u_time;
uniform float u_timeScale;

out vec2 vUv;
out vec3 f_normal;


void main() {
    vUv = uv;
    

    // vertex position
    vec4 pos = vec4(position, 1.0);
    #ifdef USE_INSTANCING
        pos = instanceMatrix * pos;
        f_normal = (instanceMatrix * vec4(normal, 0.0)).xyz;
    #endif

    // displacement
    float displacementPwr = 1.0 - cos(uv.y * M_PI / 2.0);
    float displacementZ = sin(pos.z + u_time * u_timeScale) * (.1 * displacementPwr);
    float displacementX = cos(pos.x + u_time * u_timeScale) * (.1 * displacementPwr);
    pos.z += displacementZ;
    pos.x += displacementX;

    
    vec4 modelViewPosition = modelViewMatrix * pos;
    gl_Position = projectionMatrix * modelViewPosition;
}
`;