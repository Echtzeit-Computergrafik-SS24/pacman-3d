export const fragmentShaderSrc = `
precision mediump float;

uniform vec3 u_lightDirection;
    
in vec2 vUv;
in vec3 f_normal;

out vec4 o_fragColor;


void main() {
    vec3 normal = normalize(f_normal);
    vec3 color = vec3(.41, 1.0, .5);

    // diffuse
    float diffuseIntensity = max(0.0, dot(normal, u_lightDirection));
    vec3 diffuse = diffuseIntensity * color;

    // ambient
    float ambientIntensity = .1;
    vec3 ambient = vec3(ambientIntensity);

    // distance from ground
    float clarity = (vUv.y * .5) + .5;

    o_fragColor = vec4((ambient + diffuse) * clarity, 1.0);
}
`;
