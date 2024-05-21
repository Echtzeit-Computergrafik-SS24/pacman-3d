export const fragmentShaderSrc = `
precision mediump float;
    
uniform vec3 u_lightDirection;
uniform vec3 u_diffuseColor;
uniform float u_specularIntensity;

in vec3 f_worldPos;
in vec3 f_normal;

out vec4 o_fragColor;

void main() {
    
    vec3 normal = normalize(f_normal);
    vec3 viewDirection = normalize(cameraPosition - f_worldPos);
    vec3 halfWay = normalize(viewDirection + u_lightDirection);

    // diffuse
    float diffuseIntensity = max(0.0, dot(normal, u_lightDirection));
    vec3 diffuse = diffuseIntensity * u_diffuseColor;

    // ambient
    float ambientIntensity = .07;
    vec3 ambient = vec3(ambientIntensity);

    // specular
    float specularIntensity = pow(max(.0, dot(normal, halfWay)), 64.0) * u_specularIntensity;
    vec3 specular = vec3(specularIntensity);

    o_fragColor = vec4(ambient + diffuse + specular, 1.0);
}
`;

