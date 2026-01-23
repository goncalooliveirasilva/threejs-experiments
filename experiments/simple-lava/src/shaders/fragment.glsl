precision mediump float;

varying float vRandom;

void main() {

    // colors
    vec3 blackColor = vec3(0.0);
    vec3 orangeColor = vec3(1.0, 0.4, 0.0);
    vec3 yellowColor = vec3(1.0, 1.0, 0.3);

    vec3 finalColor = mix(blackColor, orangeColor, vRandom);

    // hotspots
    if(vRandom > 0.8) {
        finalColor = mix(finalColor, yellowColor, (vRandom - 0.8) * 5.0);
    }

    gl_FragColor = vec4(finalColor, 1.0);
}