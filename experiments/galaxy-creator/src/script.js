import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const gui = new GUI()
gui.close()

// Size object
const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

const canvas = document.querySelector('#three')

// Scene
const scene = new THREE.Scene()

window.addEventListener('resize', () => {

  // Update the size object
  size.width = window.innerWidth
  size.height = window.innerHeight
  
  // Update camera
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()
  
  // Update renderer
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})


// Debug GUI object
const debug = {
  numberOfParticles: 100000,
  size: 0.01,
  radius: 5,
  numberOfsegments: 3,
  angleOffset: 1.5,
  proximity: 3,
  strength: 0.7,
  rotationSpeed: 0.01,
  heightFactor: 1.2,
  centerColor: '#d6491f',
  borderColor: '#1e3d8a'
}


// Particles
let geometry = null
let material = null
let particles = null


// Function to create a galaxy
const createGalaxy = () => {

  // Free memory
  if (particles !== null) {
    geometry.dispose()
    material.dispose()
    scene.remove(particles)
  }

  const centerColor = new THREE.Color(debug.centerColor)
  const borderColor = new THREE.Color(debug.borderColor)

  // Geometry
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(debug.numberOfParticles * 3)
  const colors = new Float32Array(debug.numberOfParticles * 3)

  for(let i = 0; i < debug.numberOfParticles; i++) {
    let j = i * 3

    // Positions
    const radius = Math.random() * debug.radius
    const angleOffset = radius * debug.angleOffset
    const angle = (i % debug.numberOfsegments) / debug.numberOfsegments * 2 * Math.PI

    const strength = debug.strength * radius

    const randomnessX = Math.pow(Math.random(), debug.proximity) * (Math.random() < 0.5 ? 1 : -1) * strength
    const randomnessY = Math.pow(Math.random(), debug.proximity) * (Math.random() < 0.5 ? 1 : -1) * strength
    const randomnessZ = Math.pow(Math.random(), debug.proximity) * (Math.random() < 0.5 ? 1 : -1) * strength
    
    positions[j] = Math.cos(angle + angleOffset) * radius + randomnessX
    positions[j + 1] = randomnessY * (1 - radius / debug.radius) * debug.heightFactor
    positions[j + 2] = Math.sin(angle + angleOffset) * radius + randomnessZ

    // Colors
    const color = centerColor.clone().lerp(borderColor, radius / debug.radius)
    colors[j] = color.r
    colors[j + 1] = color.g
    colors[j + 2] = color.b
  }

  // Attributes
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  
  // Material
  material = new THREE.PointsMaterial({
    size: debug.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })
  
  // Particles
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}


// GUI
gui.add(debug, 'numberOfParticles').name('Particles').min(100).max(1000000).step(100).onFinishChange(createGalaxy)
gui.add(debug, 'size').name('Particle size').min(0.001).max(1).step(0.001).onFinishChange(createGalaxy)
gui.add(debug, 'radius').name('Radius').min(1).max(20).step(1).onFinishChange(createGalaxy)
gui.add(debug, 'numberOfsegments').name('Segments').min(2).max(20).step(1).onFinishChange(createGalaxy)
gui.add(debug, 'angleOffset').name('Angle').min(0).max(20).step(0.1).onFinishChange(createGalaxy)
gui.add(debug, 'proximity').name('Proximity').min(1).max(10).step(1).onFinishChange(createGalaxy)
gui.add(debug, 'strength').name('Strength').min(0.01).max(5).step(0.01).onFinishChange(createGalaxy)
gui.add(debug, 'heightFactor').name('Height').min(0.1).max(debug.radius).onFinishChange(createGalaxy)
gui.add(debug, 'rotationSpeed').name('Rotation speed').min(0).max(1).step(0.01)
gui.addColor(debug, 'centerColor').name('Center color').onFinishChange(createGalaxy)
gui.addColor(debug, 'borderColor').name('Border Color').onFinishChange(createGalaxy)


// Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.set(-4, 2, 7)
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  particles.rotation.y = elapsedTime * debug.rotationSpeed

  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

createGalaxy()
tick()