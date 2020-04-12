// ColoredPoints.js
 // Vertex shader program
  var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
   gl_Position = a_Position;
   gl_PointSize = u_Size;
  }`
 
  // Fragment shader program
  var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
   gl_FragColor = u_FragColor;
  }`

 //Global Variables
 let canvas;
 let gl;
 let a_Position;
 let u_FragColor;
 let u_Size;
 let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
 let g_selectedSize = 10;

function setupWebGL(){
 // Retrieve canvas element
 canvas = document.getElementById('webgl');

 //Get the rendering context for WebGL
 gl = getWebGLContext(canvas);
 if(!gl){
    console.log('Failed to get rendering context for WebGL');
    return;
     }
 }

function connectVariablestoGLSL(){
    // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
 }
 
  // Get the storage location of a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0){
      console.log('Failed to get storage location of a_Position');
      return;
  }
 
 // Get the storage location of u_FragColor variable
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if(!u_FragColor){
    console.log('Failed to get storage location of u_FragColor');
    return;
  }

 // Get the storage location of u_Size
 u_Size = gl.getUniformLocation(gl.program, 'u_Size');
 if(!u_Size){
    console.log('Failed to get storage location of u_Size');
    return;
  }
}

function addActionsForHtmlUI(){

    //Button events
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };

    //Slider events
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

    //size slider
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
}

function main() {

 setupWebGL();
 connectVariablestoGLSL();
 
  //setup actoin for frontend UI
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

  //specify the color for clearing canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  }
 class Point{
     constructor(){
         this.type = 'point';
         this.poisition = [0.0 , 0.0, 0.0];
         this.color = [1.0, 1.0, 1.0, 1.0];
         this.size = 5.0;
     }

     render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
    
        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
        //Pass the size of the point/shape to u_Size variable
        gl.uniform1f(u_Size, size);
 
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
     }
 }
  var g_shapesList = [];//Array that holds all the pushed shapes
  
  function click(ev) {

    //Extract the event click and return it in WebGL coordinates
    let [x,y] = convertCoordinatesEventToGL(ev);

    // Create and store new point
    let point = new Point();
    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);

    //draw every shape that is supposed to be on the canvas
    renderAllShapes();
}

//Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
 
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return([x,y]);
}

//draw every shape that is supposed to be on the canvas
function renderAllShapes(){
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
       g_shapesList.render();
       var xy = g_shapesList[i].position;
       var rgba = g_shapesList[i].color;
       var size = g_shapesList[i].size;
   
       // Pass the position of a point to a_Position variable
       gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
       // Pass the color of a point to u_FragColor variable
       gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
       //Pass the size of the point/shape to u_Size variable
       gl.uniform1f(u_Size, size);

       // Draw
       gl.drawArrays(gl.POINTS, 0, 1);
    }
}
