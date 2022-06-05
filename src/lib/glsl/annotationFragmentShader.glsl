uniform sampler2D u_map;
varying vec2 v_uv;

void main() {
  vec4 texture = texture2D(u_map, v_uv);

  gl_FragColor = texture;
}
