export const fragmentShaderSrc = `
precision mediump float;

uniform vec3 u_lightDirection;
uniform sampler2D u_shadowMap;
    
in vec2 f_uv;
in vec3 f_normal;
in vec4 f_shadowCoord;

out vec4 o_fragColor;

float unpackRGBAToDepth( const in vec4 );
float calculateShadow();


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

    // shadow
    float shadow = calculateShadow();

    o_fragColor = vec4((ambient + shadow * diffuse) * clarity, 1.0);
}

const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );

float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}

float calculateShadow() {
    vec3 shadowCoord = f_shadowCoord.xyz / f_shadowCoord.w * 0.5 + 0.5;

    if(any(lessThan(shadowCoord, vec3(0))) || any(greaterThan(shadowCoord, vec3(1)))) {
        return 1.0;
    }

    float depth_depthMap = unpackRGBAToDepth(texture(u_shadowMap, shadowCoord.xy));

    float bias = 0.002;

    float shadowFactor = shadowCoord.z - bias > depth_depthMap ? 0.0 : 1.0;

    return shadowFactor;
}
`;
