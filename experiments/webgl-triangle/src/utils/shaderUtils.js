export const lookForShaderCompilationErrors = (gl, shader) => {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Error compiling shader.', gl.getShaderInfoLog(shader))
  }
}

export const lookForLinkingProgramErrors = (gl, program) => {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program', gl.getProgramInfoLog(program))
  }
}

export const lookForProgramValidationErrors = (gl, program) => {
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error(
      'Error validating the program.',
      gl.getProgramInfoLog(program),
    )
  }
}

export const hexToRgbFloat = (hex) => {
  const bigint = parseInt(hex.replace('#', ''), 16)
  const r = ((bigint >> 16) & 255) / 255
  const g = ((bigint >> 8) & 255) / 255
  const b = (bigint & 255) / 255
  return [r, g, b]
}
