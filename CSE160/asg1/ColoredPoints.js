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
 //Constants
 const POINT = 0;
 const TRIANGLE = 1;
 const CIRCLE = 2;

 //Global Variables
 let canvas;
 let gl;
 let a_Position;
 let u_FragColor;
 let u_Size;
 let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
 let g_selectedSize = 10;
 let g_selectedType = POINT;
 let g_segments;
 var g_shapesList = []; //Array that holds all the pushed shapes

function setupWebGL(){
 // Retrieve canvas element
 canvas = document.getElementById('webgl');

 //Get the rendering context for WebGL
 gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
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
    document.getElementById('clear').onclick = function() { g_shapesList = []; renderAllShapes(); };
    document.getElementById('pointButton').onclick = function() { g_selectedType = POINT };
    document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE };
    document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE };

    //Slider events
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

    //size slider
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
    //segment slider
    document.getElementById('segSlide').addEventListener('mouseup', function() { g_segments = this.value; });
}

function main() {

 setupWebGL();
 connectVariablestoGLSL();
 
  //setup actoin for frontend UI
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons ==1){  click(ev)  } };

  //specify the color for clearing canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  }
  
  function click(ev) {

    //Extract the event click and return it in WebGL coordinates
    let [x,y] = convertCoordinatesEventToGL(ev);

    // Create and store new point
    let point;
    if(g_selectedType == POINT){
        point = new Point();
    }
    else if(g_selectedType == TRIANGLE){
        point = new Triangle();
    }
    else{
        point = new Circle();
    }
    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    point.segment = g_segments;
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
       g_shapesList[i].render();
    }
}
