import * as THREE from 'three'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const gui = new GUI()
gui.close()

// Size object
const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Debug GUI object
const debug = {
  backgroundColor: '#597873',
  lightColor1: '#ff0000',
  lightColor2: '#f2b40c',
  text: 'Goncalo :)',
  numberOfObjects: 100
}

const canvas = document.querySelector('#three')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(debug.backgroundColor)

gui.addColor(debug, 'backgroundColor')
  .name('Background')
  .onChange((color) => {
    scene.background.set(color)
  })


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


// Hemisphere light
const light = new THREE.HemisphereLight(debug.lightColor1, debug.lightColor2, 2.5)
scene.add(light)

gui.addColor(debug, 'lightColor1')
  .name('Sky Color')
  .onChange((color) => {
    light.color.set(color)
  })

gui.addColor(debug, 'lightColor2')
  .name('Ground Color')
  .onChange((color) => {
    light.groundColor.set(color)
  })


// Font
const fontLoader = new FontLoader()
let mesh = null
fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry(
      debug.text,
      {
        font,
        size: 0.5,
        depth: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
      }
    )

    textGeometry.center()

    const material = new THREE.MeshStandardMaterial({ roughness: 0.4 })
    mesh = new THREE.Mesh(textGeometry, material)
    scene.add(mesh)
  
    const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    const boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)

    for (let i = 0; i < debug.numberOfObjects; i++) {
      const torus = new THREE.Mesh(torusGeometry, material)
      const box = new THREE.Mesh(boxGeometry, material)

      torus.position.x = (Math.random() - 0.5) * 15
      torus.position.y = (Math.random() - 0.5) * 15
      torus.position.z = (Math.random() - 0.5) * 15

      box.position.x = (Math.random() - 0.5) * 15
      box.position.y = (Math.random() - 0.5) * 15
      box.position.z = (Math.random() - 0.5) * 15


      torus.rotation.x = Math.random() * Math.PI
      torus.rotation.y = Math.random() * Math.PI

      box.rotation.x = Math.random() * Math.PI
      box.rotation.y = Math.random() * Math.PI

      scene.add(torus, box)
    }
    gui.add(debug, 'text')
      .name('3D Text')
      .onChange((text) => {
        mesh.geometry.dispose()
        const textGeometry = new TextGeometry(
          text,
          {
            font,
            size: 0.5,
            depth: 0.2,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4
          }
        )
        textGeometry.center()
        mesh.geometry = textGeometry 
      })
  }
)


// Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.set(0, 0, 4)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false

gui.add(controls, 'enableZoom').name('Zoom')


// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new THREE.Clock()

const tick = () => {

  const elapsedTime = clock.getElapsedTime()

  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()