const resizeCanvas = (canvas, gl, size) => {
  size.width = window.innerWidth
  size.height = window.innerHeight

  canvas.width = size.width
  canvas.height = size.height

  gl.viewport(0, 0, size.width, size.height)
}

export default resizeCanvas
