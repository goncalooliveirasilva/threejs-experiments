import * as THREE from 'three'
import GUI from 'lil-gui'

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

let resizeTimeout
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout)

  // Timeout to avoid unnecessary particle generation
  resizeTimeout = setTimeout(() => {
    // Update the size object
    size.width = window.innerWidth
    size.height = window.innerHeight
  
    // Update camera
    camera.left = size.width / - 2;
    camera.right = size.width / 2;
    camera.top = size.height / 2;
    camera.bottom = size.height / - 2;
    camera.updateProjectionMatrix()
  
    // Update renderer
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    createExperience()
  }, 100)
})


// Debug GUI object
const debug = {
  size: 6,
  numberOfParticles: 10000,
  mouseRadius: 50,
  moveDistance: 200,
  returnSpeed: 0.1,
  useRandomColors: true,
  baseColor: '#ffffff',
}


let geometry = null
let material = null
let basePositions = null
let particles = null
const baseColor = new THREE.Color(debug.baseColor)

// Function to create experience
const createExperience = () => {

  // Free memory
  if (particles !== null) {
    geometry.dispose()
    material.dispose()
    scene.remove(particles)
  }

  // Geometry
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(debug.numberOfParticles * 3)
  const colors = new Float32Array(debug.numberOfParticles * 3)

  for(let i = 0; i < debug.numberOfParticles; i++) {
    let j = i * 3

    // Positions
    positions[j] = (Math.random() * size.width) - size.width / 2
    positions[j + 1] = (Math.random() * size.height) - size.height / 2
    positions[j + 2] = 0

    // Colors
    if (debug.useRandomColors) {
      colors[j] = Math.random()
      colors[j + 1] = Math.random()
      colors[j + 2] = Math.random()
    } else {
      colors[j] = baseColor.r
      colors[j + 1] = baseColor.g
      colors[j + 2] = baseColor.b
    }
  }

  basePositions = positions.slice()

  // Attributes
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // Material
  material = new THREE.PointsMaterial({
    size: debug.size,
    vertexColors: true
  })

  // Particles
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}


// Mouse coordinates
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX - size.width / 2
  mouse.y = size.height / 2 - event.clientY // because y = 0 is on top
})


// Function to update positions
const updatePositions = () => {
  const positions = geometry.attributes.position.array

  const radiusSquared = debug.mouseRadius * debug.mouseRadius
  const moveDistance = debug.moveDistance * 0.5

  for(let i = 0; i < debug.numberOfParticles; i++) {
    let j = i * 3

    // Calculate square distance from particle to mouse
    const dx = positions[j] - mouse.x
    const dy = positions[j + 1] - mouse.y
    const distanceSquared = dx * dx + dy * dy

    if (distanceSquared < radiusSquared) {
      const distance = Math.sqrt(distanceSquared) || 0.0001 // to avoid division by 0
      const force = 1 - distanceSquared / radiusSquared

      // Normalize distance
      const dirX = dx / distance
      const dirY = dy / distance

      // Target position
      const targetX = basePositions[j] + dirX * moveDistance * force;
      const targetY = basePositions[j + 1] + dirY * moveDistance * force;

      // Move particle to target position
      positions[j] += (targetX - positions[j]) * debug.returnSpeed
      positions[j + 1] += (targetY - positions[j + 1]) * debug.returnSpeed

    } else {
      // Remain/return to original position
      positions[j] += (basePositions[j] - positions[j]) * debug.returnSpeed
      positions[j + 1] += (basePositions[j + 1] - positions[j + 1]) * debug.returnSpeed
    }
  }
  geometry.attributes.position.needsUpdate = true
}


// GUI
gui.add(debug, 'numberOfParticles').name('Particles').min(100).max(100000).onFinishChange(createExperience)
gui.add(debug, 'size').name('Particle size').min(0.1).max(10).step(0.1).onFinishChange(createExperience)
gui.add(debug, 'mouseRadius').name('Mouse radius').min(10).max(1000).step(10)
gui.add(debug, 'moveDistance').name('Move distance').min(1).max(500).step(1)
gui.add(debug, 'useRandomColors').name('Random colors').onFinishChange(createExperience)
gui.addColor(debug, 'baseColor').name('Base color').onFinishChange((value) => {
  debug.baseColor = value
  baseColor.set(value)
  if (!debug.useRandomColors) createExperience()
})


// Camera
const camera = new THREE.OrthographicCamera(
  - size.width / 2,
  size.width / 2,
  size.height / 2,
  size.height / -2,
  0.1,
  1000
)
camera.position.set(0, 0, 10)
scene.add(camera)


// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  if (geometry) updatePositions()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

createExperience()
tick()