import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const NUM_PARTICLES = 3000

const gui = new GUI()
gui.close()

// Size object
const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Debug GUI object
const debug = {
  color: '#f2b40c',
  useUniformColor: false,
  animationFunction: 'sin',
  functions: {
    'sin': (x, y, t) => Math.sin(t + x),
    'cos': (x,  y, t) => Math.cos(t + x),
    'tan': (x, y, t) => Math.tan(t + x) * 0.1,
    'sqrt(x² + y²) * sin(t)': (x, y, t) => Math.sqrt(x*x + y*y) * Math.sin(t),
    'e^(-1/4*x²)*(2sin(x*pi) - x*cos(3*y)) * sin(t)': (x, y, t) => {
      return Math.pow(Math.E, (-1/4*x*x))*((2*Math.sin(Math.PI*x)) - (x*Math.cos(3*y))) * Math.sin(t)
    },
    'sin(10(x² + y²) - t*5)/10': (x, y, t) => Math.sin(10 * Math.sqrt(x*x + y*y) - t * 5)/10,
    'sin(5x -t*5)*cos(5y -t*5)/5': (x, y, t) => Math.sin(5*x - t*5)*Math.cos(5*y - t*5)/5,
    'none': (x, y, t) => 0
  },
  axes: {
    'Ripple: sin(10(x² + y²))/10' : 'z'
  }
}

// sin(10(x² + y²) - t*5)/10 and
// sin(5x -t*5)*cos(5y -t*5)/5
// Inspiration from: https://www.benjoffe.com/code/tools/functions3d/examples

// e^(-1/4*x²)*(2sin(x*pi) - x*cos(3*y)) * sin(t) and
// e^(-1/4*x²)*(2sin(x*pi) - x*cos(3*y)) * sin(t)
// Inspiration from: https://www.desmos.com/3d-gallery?lang=pt-BR

gui.add(debug, 'animationFunction', Object.keys(debug.functions))
  .name('Animation')


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


// Particles
const geometry = new THREE.BufferGeometry()

const basePositions = new Float32Array(NUM_PARTICLES * 3)
const positions = new Float32Array(NUM_PARTICLES * 3)
const colors = new Float32Array(NUM_PARTICLES * 3)

for(let i = 0; i < NUM_PARTICLES * 3; i++) {
  const value = (Math.random() - 0.5) * 8
  positions[i] = value
  basePositions[i] = value
  colors[i] = Math.random()
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const material = new THREE.PointsMaterial({
  size: 0.05,
  sizeAttenuation: true,
  vertexColors: true
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)

gui.add(debug, 'useUniformColor')
  .name('Uniform color')
  .onChange((value) => {
    material.vertexColors = !value
    material.needsUpdate = true
    if (!value) {
      material.color.set('#ffffff')
    }
  })

gui.addColor(debug, 'color')
  .name('Color')
  .onChange((color) => {
    if (debug.useUniformColor) {
      material.color.set(color)
    }
  })


// Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.set(4, 0, 7)
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

  // Getting the correct function
  const func = debug.functions[debug.animationFunction]

  // Axis logic
  const axis = debug.axes[debug.animationFunction]
  const axisOffset = axis === 'y' ? 1 : 2
  if (axisOffset === 2) {
    particles.rotation.x = - Math.PI / 2
  } else {
    particles.rotation.x = 0
  }

  // Update particles position
  for(let i = 0; i < NUM_PARTICLES; i++) {
    let j = i * 3

    const baseX = basePositions[j]
    const baseY = basePositions[j + 1]
    const baseZ = basePositions[j + 2]

    const newValue = func(baseX, baseY, elapsedTime)

    geometry.attributes.position.array[j] = baseX
    geometry.attributes.position.array[j + 1] = baseY
    geometry.attributes.position.array[j + 2] = baseZ

    geometry.attributes.position.array[j + axisOffset] = newValue
  }

  geometry.attributes.position.needsUpdate = true

  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()