export const fragmentShaderSrc = `
precision mediump float;
    
uniform vec3 u_diffuseColor;
uniform float u_specularIntensity;
uniform float u_reflectionIntensity;
uniform float u_ambientIntensity;
uniform samplerCube u_skybox;
uniform sampler2D u_textureDiffuse;
uniform sampler2D u_textureNormal;
uniform sampler2D u_textureSpecular;
uniform bool u_useDiffuseMap;
uniform bool u_useNormalMap;
uniform bool u_useSpecularMap;

in vec3 f_normal;
in vec3 f_worldPos;
in vec3 f_lightPos;
in vec3 f_viewPos;
in vec2 f_texCoord;

out vec4 o_fragColor;

void main() {
    vec3 texDiffuse = texture(u_textureDiffuse, f_texCoord).rgb;
    vec3 texNormal = texture(u_textureNormal, f_texCoord).rgb;
    vec3 texSpecular = texture(u_textureSpecular, f_texCoord).rgb;
    

    vec3 normal;
    if(u_useNormalMap) {
        normal = normalize(texNormal * (255./128.) - 1.0);
        // normal = normalize(texNormal * 2.0 - 1.0);
    } else {
        normal = normalize(f_normal);
    }

    vec3 lightDir = normalize(f_lightPos - f_worldPos);
    vec3 viewDir = normalize(f_viewPos - f_worldPos);
    vec3 halfWay = normalize(viewDir + lightDir);

    // ambient
    vec3 ambient;
    if(u_useDiffuseMap) {
        ambient = u_ambientIntensity * texDiffuse;
    } else {
        ambient = u_ambientIntensity * u_diffuseColor;
    }

    // diffuse
    float diffuseIntensity = max(0.0, dot(normal, lightDir)) * (1.0 - u_ambientIntensity);
    vec3 diffuse;
    if(u_useDiffuseMap) {
        diffuse = diffuseIntensity * texDiffuse;
    } else {
        diffuse = diffuseIntensity * u_diffuseColor;
    }

    // specular
    float specularIntensity = pow(max(.0, dot(normal, halfWay)), 64.0) * u_specularIntensity;
    vec3 specular;
    if(u_useSpecularMap) {
        specular = vec3(specularIntensity) * texSpecular;
    } else {
        specular = vec3(specularIntensity);
    } 

    // cubemap reflection
    vec3 reflectionDirection = reflect(viewDir, normal);
    reflectionDirection.x = -reflectionDirection.x;
    vec3 reflection = texture(u_skybox, reflectionDirection).rgb;

    // o_fragColor = vec4(ambient + diffuse + specular, 1.0);
    o_fragColor = vec4(mix(vec3(ambient + diffuse + specular), reflection, u_reflectionIntensity), 1.0);
}
`;
