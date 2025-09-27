import {
  lookForShaderCompilationErrors,
  lookForLinkingProgramErrors,
  lookForProgramValidationErrors,
  hexToRgbFloat,
} from './utils/shaderUtils'
import vertexShader from './shaders/vertexShader'
import fragmentShader from './shaders/fragmentShader'
import resizeCanvas from './utils/resizeCanvas'
import GUI from 'lil-gui'

// Debug GUI object
const debug = {
  topColor: '#ff0000',
  leftColor: '#0000ff',
  rightColor: '#00ff00',
}

const gui = new GUI()
gui.close()
gui.addColor(debug, 'topColor').name('Top Color')
gui.addColor(debug, 'leftColor').name('Left Color')
gui.addColor(debug, 'rightColor').name('Right Color')

const start = () => {
  const canvas = document.getElementById('three')
  const gl = canvas.getContext('webgl')

  // Size object
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // Create shaders
  const vertShader = gl.createShader(gl.VERTEX_SHADER)
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(vertShader, vertexShader)
  gl.shaderSource(fragShader, fragmentShader)

  // Compile Shaders
  gl.compileShader(vertShader)
  lookForShaderCompilationErrors(gl, vertShader)
  gl.compileShader(fragShader)
  lookForShaderCompilationErrors(gl, fragShader)

  // Program
  const program = gl.createProgram()
  gl.attachShader(program, vertShader)
  gl.attachShader(program, fragShader)
  gl.linkProgram(program)
  lookForLinkingProgramErrors(gl, program)
  gl.validateProgram(program)
  lookForProgramValidationErrors(gl, program)

  gl.useProgram(program)

  // Attributes
  const positionAttributeLocation = gl.getAttribLocation(
    program,
    'vertPosition',
  )
  const colorAttributeLocation = gl.getAttribLocation(program, 'vertColor')

  // Uniform
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    'uResolution',
  )

  // Create Buffer
  const triangleVertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer)

  // Render Function
  const render = () => {
    resizeCanvas(canvas, gl, size)

    // Centered triangle vertices
    const cx = size.width / 2
    const cy = size.height / 2
    const halfWidth = size.width * 0.2 // 20% of window width
    const halfHeight = size.height * 0.3 // 30% of window height

    const topColor = hexToRgbFloat(debug.topColor)
    const leftColor = hexToRgbFloat(debug.leftColor)
    const rightColor = hexToRgbFloat(debug.rightColor)

    const triangleVerticesData = [
      // x, y, r, g, b
      [cx, cy - halfHeight, ...topColor], // top
      [cx - halfWidth, cy + halfHeight, ...leftColor], // left
      [cx + halfWidth, cy + halfHeight, ...rightColor], // right
    ]
    const triangleVertices = new Float32Array(triangleVerticesData.flat())

    // Upload data
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW)

    // Position attribute
    gl.vertexAttribPointer(
      positionAttributeLocation,
      2,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      0,
    )
    gl.enableVertexAttribArray(positionAttributeLocation)

    // Color attribute
    gl.vertexAttribPointer(
      colorAttributeLocation,
      3,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      2 * Float32Array.BYTES_PER_ELEMENT,
    )
    gl.enableVertexAttribArray(colorAttributeLocation)

    // Draw
    gl.uniform2f(resolutionUniformLocation, size.width, size.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  // Inital render
  render()
  gui.onChange(render)

  window.addEventListener('resize', () => {
    render()
  })
}

start()
