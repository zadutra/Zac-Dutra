// ColoredPoints.js
 // Vertex shader program
  var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  ' gl_Position = a_Position;\n' +
  ' gl_PointSize = 10.0;\n' +
  '}\n';
 
  // Fragment shader program
  var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' + // uniform variable <- (1)
  'void main() {\n' +
  ' gl_FragColor = u_FragColor;\n' + <- (2)
  '}\n';
 
  function main() {
 // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
 
 }
 
  // Get the storage location of a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
 
 // Get the storage location of u_FragColor variable
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
 
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position,
 ➥u_FragColor) };
 
  gl.clear(gl.COLOR_BUFFER_BIT);
  }
 
  var g_points = []; // The array for a mouse press
  var g_colors = []; // The array to store the color of a point
  function click(ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();
 
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
 
  // Store the coordinates to g_points array
  g_points.push([x, y]);
  // Store the color to g_colors array
 if(x >= 0.0 && y >= 0.0) { // First quadrant
 g_colors.push([1.0, 0.0, 0.0, 1.0]); // Red
