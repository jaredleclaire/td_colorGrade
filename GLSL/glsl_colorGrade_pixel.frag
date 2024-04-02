//a fragment shader for basic grading controls 

uniform float uTemperature;
uniform float uTint;
uniform float uExposure;
uniform vec3 uLift;
uniform vec3 uGamma;
uniform vec3 uGain;
uniform vec3 uOffset;
uniform float uSaturation;

out vec4 fragColor;
void main()
{
	//input texture
	vec4 color = texture(sTD2DInputs[0], vUV.st);
	
	//color temperature
	color.r *= 1 - (uTemperature / 2);
	color.b *= 1 + (uTemperature / 2);
	
	//tint
	color.r *= 1 + (uTint / 3);
	color.g *= 1 - ((uTint * 2) / 3);
	color.b *= 1 + (uTint / 3);
	
	//exposure
	color.rgb *= 1 + uExposure;
	
	//LGG
	color.rgb = pow(max(vec3(0.0), color.rgb * (1.0 + uGain - uLift) + uLift + uOffset), max(vec3(0.0), 1.0 - uGamma));
	
	//saturation
	vec3 hsv;
	hsv.xyz = TDRGBToHSV(color.rgb);
	hsv.y *= uSaturation;
	color.rgb = TDHSVToRGB(hsv.xyz);
	
	//output swizzle
	fragColor = TDOutputSwizzle(color);
}
