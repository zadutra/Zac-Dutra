// ColoredPoints.js
 // Vertex shader program
  var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  varying vec4 v_vertPos;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    //gl_Position = u_ProjectionMatrix * u_ViewMatrix * a_Position;
    //gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_vertPos = u_ModelMatrix * a_Position;
  }`
 
  // Fragment shader program
  var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_vertPos;
  uniform bool u_lightOn;
  float r;
  void main() {
    if(u_whichTexture == 3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    }
    else if(u_whichTexture == 2){
      gl_FragColor = u_FragColor; //use color
    }
    else if(u_whichTexture == 1){
      gl_FragColor = vec4(v_UV, 0, 1.0); //use texture 1
    }
    else if (u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV); //use texture 0
    }
    else{
      gl_FragColor = vec4(1,0.2,0.2,1); //error put red
    }

    vec3 lightVector = u_lightPos - vec3(v_vertPos);
    r = length(lightVector);
    //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r), 1);

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    vec3 R = reflect(-L,N);
    vec3 E = normalize(u_cameraPos - vec3(v_vertPos));
    float specular = pow(max(dot(E,R), 0.0), 2.5);

    vec3 diffuse = vec3(gl_FragColor) * nDotL;
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    if(u_lightOn == true){
      gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
    }
    else{
      gl_FragColor = vec4(ambient, 1.0);
    }
  }`


 //Global Variables
 let canvas;
 let gl;
 let a_Position;
 let a_UV;
 let a_Normal;
 let u_FragColor;
 let u_Size;
 let u_ModelMatrix;
 let u_GlobalRotateMatrix;
 let u_ProjectionMatrix;
 let u_ViewMatrix;
 let u_Sampler0;
 let u_cameraPos;
 let u_lightOn;
 //let u_Sampler1;
 let u_whichTexture;
 let u_lightPos;
 let g_globalAngle;
 let g_normalOn;
 let g_lightPos = [0,3,0];
 let g_lightOn;


 var g_eye = new Vector3([0,0,2]);
 var g_at = new Vector3([20, 0,-100]);
 var g_up = new Vector3([0,1,0]);

function setupWebGL(){
 // Retrieve canvas element
 canvas = document.getElementById('webgl');

 //Get the rendering context for WebGL
 gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
 if(!gl){
    console.log('Failed to get rendering context for WebGL');
    return;
     }

 gl.enable(gl.DEPTH_TEST);
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
  
  //get storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if(a_UV < 0){
      console.log('Failed to get the storage location of a_UV');
      return;
  }
  //get storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_Normal < 0){
    console.log('Failed to get the storage location of a_Normal');
    return;
  }
 
 // Get the storage location of u_FragColor variable
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if(!u_FragColor){
    console.log('Failed to get storage location of u_FragColor');
    return;
  }

 // Get the storage location of u_ModelMatrix
 u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
 if(!u_ModelMatrix){
    console.log('Failed to get storage location of u_ModelMatrix');
    return;
  }

 // get the storage location of u_GlobalRotateMatrix
 u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
 if(!u_GlobalRotateMatrix){
    console.log('Failed to get storage location of u_GlobalRotateMatrix');
    return;
  }

 // get the storage location of u_ViewMatrix
 u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
 if(!u_ViewMatrix){
    console.log('Failed to get storage location of u_ViewMatrix');
    return;
  }
 // get the storage location of u_ProjectionMatrix
 u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
 if(!u_ProjectionMatrix){
   console.log('Failed to get storage location of u_ProjectionMatrix');
   return;
 }

// Get the storage location of u_Sampler0
u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
if (!u_Sampler0) {
  console.log('Failed to get the storage location of u_Sampler0');
  return false;
}
/*
// Get the storage location of u_Sampler1
u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
if (!u_Sampler1) {
  console.log('Failed to get the storage location of u_Sampler1');
  return false;
}
*/
//get storage location for u_whichTexture
u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
if (!u_whichTexture) {
  console.log('Failed to get the storage location of u_whichTexture');
  return false;
}

u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
if (!u_lightPos) {
  console.log('Failed to get the storage location of u_lightPos');
  return false;
}

u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
if (!u_cameraPos) {
  console.log('Failed to get the storage location of u_cameraPos');
  return false;
}

u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
if (!u_lightOn) {
  console.log('Failed to get the storage location of u_lightOn');
  return false;
}

  //set initial value for this matrix to the identity matrix
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function addActionsForHtmlUI(){

    //camera slider
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });
    //normals
    document.getElementById('normalOn').onclick = function() {g_normalOn = true; renderAllShapes();};
    document.getElementById('normalOff').onclick = function() {g_normalOn = false; renderAllShapes();};
    document.getElementById('lightOn').onclick = function() {g_lightOn = true; renderAllShapes();};
    document.getElementById('lightOff').onclick = function() {g_lightOn = false; renderAllShapes();};
    //light sliders
    document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) { if(ev.buttons==1){g_lightPos[0] = this.value; renderAllShapes(); }});
    document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) { if(ev.buttons==1){g_lightPos[1] = this.value; renderAllShapes(); }});
    document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) { if(ev.buttons==1){g_lightPos[2] = this.value; renderAllShapes(); }});


  }


function initTextures() {
  
    var image0 = new Image();  // Create the image object
    if (!image0) {
      console.log('Failed to create the image0 object');
      return false;
    }
    // Register the event handler to be called on loading an image
    image0.onload = function(){ sendImageToTEXTURE0(image0); };
    // Tell the browser to load an image
    image0.src = 'sky.jpg';
    
    //add future textures here
    /*var image1 = new Image();
    if(!image1){
      console.log('Faield to load image1 object');
    }
    image1.onload = function(){ sendImageToTEXTURE1(image1); };
    image1.src = 'dirt.jpg';
    */
    return true;
}


function sendImageToTEXTURE0(image) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);
    
    //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
  
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}
var g_startTime = performance.now()/1000;
var g_seconds = performance.now()/1000-g_startTime;
 
function tick(){
    g_seconds = performance.now()/1000-g_startTime;
    animationAngles();
    renderAllShapes();
    requestAnimationFrame(tick);

function animationAngles(){
   g_lightPos[0] = Math.cos(g_seconds);
  }
}
function main() {

 setupWebGL();
 connectVariablestoGLSL();
 
  //setup actoin for frontend UI
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousemove = function(ev) { if(ev.buttons ==1){  click(ev)  } };
  
  document.onkeydown = keydown;

  initTextures();

  //specify the color for clearing canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //clear canvas
  //gl.clear(gl.COLOR_BUFFER_BIT);
  renderAllShapes();
  requestAnimationFrame(tick);
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

function keydown(ev){
  if(ev.keyCode == 68){ //right
    var f = new Vector3();
    var g = new Vector3();
    f.set(g_at);
    f.sub(g_at, g_eye);
    var s = f.elements;
      var t = g_up.elements;
      var x0 = (-s[1]*t[2]) - (-s[2]*t[1]);
      var x1 = (-s[2]*t[0]) - (-s[0]*t[2]);
      var x2 = (-s[0]*t[1]) - (-s[1]*t[0]);
    g.elements = [x0, x1, x2];
    g.normalize(g);
    g_eye.sub(g_eye, g);
  }
  else if(ev.keyCode == 65){ //left
    var f = new Vector3();
    var g = new Vector3();
    f.set(g_at);
    f.sub(g_at, g_eye);
    var s = f.elements;
      var t = g_up.elements;
      var x0 = (s[1]*t[2]) - (s[2]*t[1]);
      var x1 = (s[2]*t[0]) - (s[0]*t[2]);
      var x2 = (s[0]*t[1]) - (s[1]*t[0]);
    g.elements = [x0, x1, x2];
    g.normalize(g);
    g_eye.sub(g_eye, g);
  }
  else if(ev.keyCode == 87){//forward
    var f = new Vector3();
    var g= new Vector3();
    f.set(g_at);
    f.sub(g_at, g_eye);
    g.normalize(f);
    g_eye.add(g, g_eye);
    g_at.add(g, g_at);
  }
  else if (ev.keyCode == 83){ //back
    var f = new Vector3();
    var g= new Vector3();
    f.set(g_at);
    f.sub(g_at, g_eye);
    g.normalize(f);
    g_eye.sub(g_eye, g);
    g_at.sub(g_at, g);
  }
  else if(ev.keyCode == 69){//rotate right
    var f = new Vector3();
        f.set(g_at);
        f.sub(g_at, g_eye);
        let rotMatrix = new Matrix4();
        rotMatrix.setRotate(-10, g_up.elements[0], g_up.elements[1], g_up.elements[2]);
        let f2 = new Vector3();
        f2 = rotMatrix.multiplyVector3(f);
        g_at.add(f2, g_eye);
  }
  else if(ev.keyCode == 81){//rotate left
    var f = new Vector3();
        f.set(g_at);
        f.sub(g_at, g_eye);
        let rotMatrix = new Matrix4();
        rotMatrix.setRotate(10, g_up.elements[0], g_up.elements[1], g_up.elements[2]);
        let f2 = new Vector3();
        f2 = rotMatrix.multiplyVector3(f);
        g_at.add(f2, g_eye);
  }
  else if(ev.keyCode == 38){ //jump
    g_eye.elements[1] += 0.5;
  }
  else if(ev.keyCode == 40){ //back down
    g_eye.elements[1] -= 0.5;
  }

  renderAllShapes();
}
function addBlock(ev){
  var temp = new Cube();
  temp.color = [1, 1, 0, 1];
  temp.textureNum = 2;
  temp.matrix.translate(g_eye.elements[0], g_eye.elements[1], g_eye.elements[2]);
  temp.matrix.scale(0.5, 0.5, 0.5);
  temp.render();

}

 var g_map = [
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
   [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1], 
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1],
   [1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
 ];

function drawMap(){
  for(x = 0; x < 32; x++){
    for(y = 0; y < 32; y++){
      if(g_map[x][y] == 1){
        var block = new Cube();
        block.color = [1, 1, 0, 1];
        block.textureNum = 2;
        block.matrix.translate(x-4, -0.75, y-4);
        block.matrix.scale(0.5, 0.5, 0.5);
        block.render();
      }
    }
  }
}
//draw every shape that is supposed to be on the canvas
function renderAllShapes(){

    var projMat = new Matrix4();
    projMat.setPerspective(50, canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(g_eye.elements[0], g_eye.elements[1], g_eye.elements[2],  g_at.elements[0], g_at.elements[1], g_at.elements[2],  g_up.elements[0], g_up.elements[1], g_up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //add light to GLSL
    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

    //add camera to GLSL
    gl.uniform3f(u_cameraPos, g_eye.elements[0], g_eye.elements[1], g_eye.elements[2]);

    //add light to GLSL
    gl.uniform1f(u_lightOn, g_lightOn);
    //drawMap();

    //draw light
    var light = new Cube();
    light.color = [1,0,0,1];
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(-0.5, -0.5, -0.5);
    light.render();

    //draw sphere
    var sphereTest = new Sphere();
    sphereTest.color=[1,1,1,1];
    if(g_normalOn == true){
      sphereTest.textureNum = 3;
    }
    sphereTest.matrix.translate(3,1,0);
    
    sphereTest.render();

    var head = new Cube();
    head.color = [1, 1, 1, 1];
    if(g_normalOn == true){
      head.textureNum = 3;
    }
    head.matrix.translate(-0.15, 0.25, 0, 0);
    var headMatrix = new Matrix4(head.matrix);
    head.matrix.rotate(0, 1, 0, 0);
    head.matrix.scale(0.3, 0.35, 0.3);
    head.render();

    //draw body cube
    var body = new Cube();
    body.color = [1.0, 0.0, 0.0, 1.0];
    if(g_normalOn == true){
      body.textureNum = 3;
    }
    body.matrix.translate(-0.35, 0.25, 0.0);
    body.matrix.rotate(-90, 1, 0, 0);
    body.matrix.scale(0.7, -0.3, -0.65);
    body.render();
    

    //draw left arm
    var leftArm = new Cube();
    leftArm.color = [0, 1, 0, 1];
    if(g_normalOn == true){
      leftArm.textureNum = 3;
    }
    leftArm.matrix.translate(-0.35, 0, 0.10);
    //leftArm.matrix.rotate(g_leftArmAngle, 0, 0, 1);
    var leftArmMatrix = new Matrix4(leftArm.matrix);
    leftArm.matrix.rotate(-280, 0, 0, 1);
    leftArm.matrix.scale(0.15, 0.45, 0.15);
    leftArm.render();

    //draw left hand
    var leftHand = new Cube();
    leftHand.color = [0, 0, 1, 1];
    if(g_normalOn == true){
      leftHand.textureNum = 3;
    }
    leftHand.matrix = leftArmMatrix;
    leftHand.matrix.translate(-0.40, 0.225, -0.0001);
    //leftHand.matrix.rotate(-g_leftHandAngle, 0, 1, 0);
    leftHand.matrix.rotate(170, 0, 0, 1);
    leftHand.matrix.scale(0.15, 0.15, 0.15);
    leftHand.render();


    //draw right arm
    var rightArm = new Cube();
    rightArm.color = [0, 1, 0, 1];
    if(g_normalOn == true){
      rightArm.textureNum = 3;
    }
    rightArm.matrix.translate(0.35, -0.45, 0.10);
    var rightArmMatrix = new Matrix4(rightArm.matrix);
    rightArm.matrix.scale(0.15, 0.45, 0.15);
    rightArm.render();

    //draw right hand
    var rightHand = new Cube();
    rightHand.color = [0, 0, 1, 1];
    if(g_normalOn == true){
      rightHand.textureNum = 3;
    }
    rightHand.matrix = rightArmMatrix;
    rightHand.matrix.translate(0.0, -0.12, -0.0001);
    rightHand.matrix.rotate(00, 0, 0, 1);
    rightHand.matrix.scale(0.15, 0.15, 0.15);
    rightHand.render();

    //draw left leg
    var leftLeg = new Cube();
    leftLeg.color = [1, 1, 0, 1];
    if(g_normalOn == true){
      leftLeg.textureNum = 3;
    }
    leftLeg.matrix.translate(-0.3, -0.92, 0.07);
    leftLeg.matrix.scale(0.18, 0.53, 0.18);
    leftLeg.render();

    //draw right leg
    var rightLeg = new Cube();
    rightLeg.color = [1, 1, 0, 1];
    if(g_normalOn == true){
      rightLeg.textureNum = 3;
    }
    rightLeg.matrix.translate(0.12, -0.92, 0.07);
    rightLeg.matrix.scale(0.18, 0.53, 0.18);
    rightLeg.render();

    //draw eyes
    var leftEye = new Cube();
    leftEye.color = [0, 0, 0, 1];
    if(g_normalOn == true){
      leftEye.textureNum = 3;
    }
    leftEye.matrix.translate(-0.09, 0.45, -0.0001);
    leftEye.matrix.scale(0.05, 0.05, 0.05);
    leftEye.render();

    var rightEye = new Cube();
    rightEye.color = [0, 0, 0, 1];
    if(g_normalOn == true){
      rightEye.textureNum = 3;
    }
    rightEye.matrix.translate(0.05, 0.45, -0.0001);
    rightEye.matrix.scale(0.05, 0.05, 0.05);
    rightEye.render();

    //draw nose
    var nose = new Cube();
    nose.color = [0, 0, 0, 1];
    if(g_normalOn == true){
      nose.textureNum = 3;
    }
    nose.matrix.translate(-0.005, 0.4, -0.0001);
    nose.matrix.scale(0.02, 0.02, 0.02);
    nose.render();

    //draw mouth
    var mouth = new Cube();
    mouth.color = [0, 0, 0, 1];
    if(g_normalOn == true){
      mouth.textureNum = 3;
    }
    mouth.matrix.translate(-0.070, 0.32, -0.0001);
    mouth.matrix.scale(0.155, 0.03, 0.05);
    mouth.render();

    //draw smile
    var smileLeft = new Cube();
    smileLeft.color = [0, 0, 0, 1];
    if(g_normalOn == true){
      smileLeft.textureNum = 3;
    }
    smileLeft.matrix.translate(-0.065, 0.35, -0.0001);
    //smileLeft.matrix.rotate(-g_mouthAngle, 1, 0, 0);
    var mouthMatrix = new Matrix4(smileLeft.matrix);
    smileLeft.matrix.rotate(180, 0, 0, 1);
    smileLeft.matrix.scale(0.03, 0.03, 0.03);
    smileLeft.render();

    var smileRight = new Cube();
    smileRight.color = [0, 0, 0, 1];
    if(g_normalOn == true){
      smileRight.textureNum = 3;
    }
    smileRight.matrix = mouthMatrix;
    smileRight.matrix.translate(0.175, -.03, -0.0001);
    smileRight.matrix.rotate(-90, 0, 1, 0);
    smileRight.matrix.scale(0.03, 0.03, 0.03);
    smileRight.render();

    //draw floor
    var floor = new Cube();
    floor.color = [34, 139, 34, 1];
    floor.textureNum = 1;
    if(g_normalOn == true){
      floor.textureNum = 3;
    }
    floor.matrix.translate(0, -0.75, 0, 0);
    floor.matrix.scale(30, 0, 30);
    floor.matrix.translate(-0.5, 0, -0.5);
    floor.render();

    //draw skybox
    var skybox = new Cube();
    skybox.color = [1, 1, 0, 1];
    skybox.textureNum = 2;
    if(g_normalOn == true){
      skybox.textureNum = 3;
    }
    skybox.matrix.scale(-20, -20, -20);
    skybox.matrix.translate(-0.5, -0.5, -0.5);
    skybox.render();

    

}