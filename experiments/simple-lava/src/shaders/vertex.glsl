uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uTime;

attribute vec3 position;
attribute float aRandom;

varying float vRandom;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float offset = aRandom * 5.0;

    modelPosition.z += sin(uTime + offset) * 0.05;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vRandom = aRandom;
}