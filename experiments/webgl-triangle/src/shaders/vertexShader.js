const vertexShader = `
  precision mediump float;
  attribute vec2 vertPosition;
  attribute vec3 vertColor;
  varying vec3 fragColor;

  uniform vec2 uResolution;

  void main() {
    // Convert from pixel space to clip space
    vec2 clipSpace = (vertPosition / uResolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0); // flip Y
    fragColor = vertColor;
  }
`

export default vertexShader
