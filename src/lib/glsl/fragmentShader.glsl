#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

uniform vec2 u_mouse;
uniform vec2 u_res;
varying vec2 v_uv;

uniform float u_time;
uniform float u_progressHover;

uniform sampler2D u_image;
uniform sampler2D u_imagehover;

float circle(in vec2 _st, in float _radius, in float blurriness){
	vec2 dist = _st;
	return 1.-smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
}

void main() {
	vec2 res = u_res * PR;
	vec2 st = gl_FragCoord.xy / res.xy - vec2(0.5);
  float grd = 0.1 * progressHover;

	st.y *= u_res.y / u_res.x;

	vec2 mouse = u_mouse * -0.5;

	mouse.y *= u_res.y / u_res.x;
	mouse *= -1.;

	vec2 circlePos = st - mouse;

	float radUL = .001; // upper-limit

	float minimum = min(u_time * 0.01, radUL);

  float c = circle(circlePos, minimum * progressHover, 2.) * 2.5;

  float offx = v_uv.x + sin(v_uv.y + u_time * .1);
  float offy = v_uv.y - u_time * 0.1 - cos(u_time * .001) * .01;

  float n = (snoise3(vec3(offx, offy, u_time * .1) * 8.) - 1. )* progressHover;

  float finalMask = smoothstep(0.4, 0.5, n + pow(c, 2.));

	vec4 image = texture2D(u_image, v_uv);
	vec4 hover = texture2D(u_imagehover, v_uv * progressHover);

	vec4 finalImage = mix(image, hover, finalMask);

	gl_FragColor = finalImage;
}
