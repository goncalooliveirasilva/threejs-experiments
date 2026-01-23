import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

// canvas
const canvas = document.querySelector("#three");

// scene
const scene = new THREE.Scene();

// geometry
const geometry = new THREE.PlaneGeometry(4, 4, 64, 64);

// number of vertices
const count = geometry.attributes.position.count;
const randomArray = new Float32Array(count);

// random numbers
for (let i = 0; i < count; i++) {
  randomArray[i] = Math.random();
}
geometry.setAttribute("aRandom", new THREE.BufferAttribute(randomArray, 1));

// material
const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  wireframe: false,
  uniforms: {
    uTime: { value: 0 },
  },
});

// mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// window size
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100,
);
camera.position.set(0, -3.5, 1.5);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update material
  material.uniforms.uTime.value = elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
