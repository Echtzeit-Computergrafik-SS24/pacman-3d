export const fragmentShaderSrc = `
precision mediump float;


uniform vec3 u_lightDirection;
    
in vec2 f_uv;
in vec3 f_normal;

out vec4 o_fragColor;


void main() {
    vec3 normal = normalize(f_normal);
    vec3 color = vec3(0.08,0.2,0.02);

    // diffuse
    float diffuseIntensity = max(0.0, dot(normal, u_lightDirection));
    vec3 diffuse = /* diffuseIntensity * */ color;

    // ambient
    float ambientIntensity = .1;
    vec3 ambient = vec3(ambientIntensity);

    // distance from ground
    float clarity = (f_uv.y * .5) + .5;

    o_fragColor = vec4((ambient + diffuse) * clarity, 1.0);
}
`;
