 // HelloPoint1.js
  // Vertex shader program
  var VSHADER_SOURCE =
      'attribute vec4 a_Position;\n'+
  'void main() {\n' +
  ' gl_Position = a_Position;\n' + // Coordinates
  ' gl_PointSize = 10.0;\n' + // Set the point size
  '}\n';
 
  // Fragment shader program
 var FSHADER_SOURCE = `
 void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
 }`

 function main() {
 // Retrieve <canvas> element
 var canvas = document.getElementById('webgl');

 // Get the rendering context for WebGL
 var gl = getWebGLContext(canvas);
 if (!gl) {
 console.log('Failed to get the rendering context for WebGL');
 return;
 }

 // Initialize shaders
 if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
 console.log('Failed to initialize shaders.');
 return;
 }
  
 //Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
   console.log('Failed to get the storage location of a_Position');
  }

 //Pass vertex position to attribute variable
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  
 // Set the color for clearing <canvas>
 gl.clearColor(0.0, 0.0, 0.0, 1.0);

 // Clear <canvas>
 gl.clear(gl.COLOR_BUFFER_BIT);

// Draw a point
gl.drawArrays(gl.POINTS, 0, 1);
}
