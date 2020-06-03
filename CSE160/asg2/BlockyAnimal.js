// ColoredPoints.js
 // Vertex shader program
  var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
   gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
 let u_ModelMatrix;
 let u_GlobalRotateMatrix;
 let g_globalAngle;
 let g_leftArmAngle;
 let g_leftHandAngle;
 let g_mouthAngle;
 let g_armAnimation = false;
 let g_mouthAnimation = false;
 let controlVal = 0;

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

  //set initial value for this matrix to the identity matrix
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function addActionsForHtmlUI(){
    /*
    //Button events
    document.getElementById('armOn').onclick = function() { g_armAnimation = true; };
    document.getElementById('armOff').onclick = function() { g_armAnimation = false; };
    document.getElementById('mouthOn').onclick = function() { g_mouthAnimation = true; };
    document.getElementById('mouthOff').onclick = function() { g_mouthAnimation = false; };

    //Slider events
    document.getElementById('leftArmSlide').addEventListener('mousemove', function() { g_leftArmAngle = this.value; renderAllShapes(); });
    document.getElementById('leftHandSlide').addEventListener('mousemove', function() { g_leftHandAngle = this.value; renderAllShapes(); });
    document.getElementById('mouthSlide').addEventListener('mousemove', function() { g_mouthAngle = this.value; renderAllShapes(); });
    */

    //camera slider
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });
}

function main() {

 setupWebGL();
 connectVariablestoGLSL();
 
  //setup actoin for frontend UI
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousemove = function(ev) { if(ev.buttons ==1){  click(ev)  } };

  //specify the color for clearing canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //clear canvas
  //gl.clear(gl.COLOR_BUFFER_BIT);
  renderAllShapes();
  //requestAnimationFrame(tick);
  }
  

var g_startTime = performance.now()/1000;
var g_seconds = performance.now()/1000-g_startTime;
 
function tick(){
    g_seconds = performance.now()/1000-g_startTime;
    animationAngles();
    renderAllShapes();
    requestAnimationFrame(tick);
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


function animationAngles(){
    if(g_armAnimation == true){
        g_leftArmAngle = 45*Math.sin(g_seconds);
    }
    if(g_mouthAnimation == true){
        g_mouthAngle = Math.abs(90*Math.sin(g_seconds));
    }
}
//draw every shape that is supposed to be on the canvas
function renderAllShapes(){

    var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);
    /*
    //head
    var head = new Cube();
    head.color = [1, 1, 1, 1];
    head.matrix.translate(-0.15, 0.25, 0, 0);
    var headMatrix = new Matrix4(head.matrix);
    head.matrix.rotate(0, 1, 0, 0);
    head.matrix.scale(0.3, 0.35, 0.3);
    head.render();

    //draw body cube
    var body = new Cube();
    body.color = [1.0, 0.0, 0.0, 1.0];
    body.matrix.translate(-0.35, 0.25, 0.0);
    body.matrix.rotate(-90, 1, 0, 0);
    body.matrix.scale(0.7, -0.3, -0.65);
    body.render();
    

    //draw left arm
    var leftArm = new Cube();
    leftArm.color = [0, 1, 0, 1];
    leftArm.matrix.translate(-0.35, 0, 0.10);
    leftArm.matrix.rotate(g_leftArmAngle, 0, 0, 1);
    var leftArmMatrix = new Matrix4(leftArm.matrix);
    leftArm.matrix.rotate(-280, 0, 0, 1);
    leftArm.matrix.scale(0.15, 0.45, 0.15);
    leftArm.render();

    //draw left hand
    var leftHand = new Cube();
    leftHand.color = [0, 0, 1, 1];
    leftHand.matrix = leftArmMatrix;
    leftHand.matrix.translate(-0.40, 0.225, -0.0001);
    leftHand.matrix.rotate(-g_leftHandAngle, 0, 1, 0);
    leftHand.matrix.rotate(170, 0, 0, 1);
    leftHand.matrix.scale(0.15, 0.15, 0.15);
    leftHand.render();


    //draw right arm
    var rightArm = new Cube();
    rightArm.color = [0, 1, 0, 1];
    rightArm.matrix.translate(0.35, -0.45, 0.10);
    var rightArmMatrix = new Matrix4(rightArm.matrix);
    rightArm.matrix.scale(0.15, 0.45, 0.15);
    rightArm.render();

    //draw right hand
    var rightHand = new Cube();
    rightHand.color = [0, 0, 1, 1];
    rightHand.matrix = rightArmMatrix;
    rightHand.matrix.translate(0.0, -0.12, -0.0001);
    rightHand.matrix.rotate(00, 0, 0, 1);
    rightHand.matrix.scale(0.15, 0.15, 0.15);
    rightHand.render();

    //draw left leg
    var leftLeg = new Cube();
    leftLeg.color = [1, 1, 0, 1];
    leftLeg.matrix.translate(-0.3, -0.92, 0.07);
    leftLeg.matrix.scale(0.18, 0.53, 0.18);
    leftLeg.render();

    //draw right leg
    var rightLeg = new Cube();
    rightLeg.color = [1, 1, 0, 1];
    rightLeg.matrix.translate(0.12, -0.92, 0.07);
    rightLeg.matrix.scale(0.18, 0.53, 0.18);
    rightLeg.render();

    //draw eyes
    var leftEye = new Cube();
    leftEye.color = [0, 0, 0, 1];
    leftEye.matrix.translate(-0.09, 0.45, -0.0001);
    leftEye.matrix.scale(0.05, 0.05, 0.05);
    leftEye.render();

    var rightEye = new Cube();
    rightEye.color = [0, 0, 0, 1];
    rightEye.matrix.translate(0.05, 0.45, -0.0001);
    rightEye.matrix.scale(0.05, 0.05, 0.05);
    rightEye.render();

    //draw nose
    var nose = new Cube();
    nose.color = [0, 0, 0, 1];
    nose.matrix.translate(-0.005, 0.4, -0.0001);
    nose.matrix.scale(0.02, 0.02, 0.02);
    nose.render();

    //draw mouth
    var mouth = new Cube();
    mouth.color = [0, 0, 0, 1];
    mouth.matrix.translate(-0.070, 0.32, -0.0001);
    mouth.matrix.scale(0.155, 0.03, 0.05);
    mouth.render();

    //draw smile
    var smileLeft = new Cube();
    smileLeft.color = [0, 0, 0, 1];
    smileLeft.matrix.translate(-0.065, 0.35, -0.0001);
    smileLeft.matrix.rotate(-g_mouthAngle, 1, 0, 0);
    var mouthMatrix = new Matrix4(smileLeft.matrix);
    smileLeft.matrix.rotate(180, 0, 0, 1);
    smileLeft.matrix.scale(0.03, 0.03, 0.03);
    smileLeft.render();

    var smileRight = new Cube();
    var angle = -g_mouthAngle;
    smileRight.color = [0, 0, 0, 1];
    smileRight.matrix = mouthMatrix;
    smileRight.matrix.translate(0.175, -.03, -0.0001);
    smileRight.matrix.rotate(-90, 0, 1, 0);
    smileRight.matrix.scale(0.03, 0.03, 0.03);
    smileRight.render();

    */

    
   var galaga = new Cube();
   galaga.color = [1, 1, 1, 1];
   galaga.textureNum = 2;
   var template = galaga;
   galaga.matrix.translate( 0 + controlVal, -0.5, 0)
   galaga.matrix.scale(0.05, 0.05, 0.05);
   galaga.render();


   var g2 = template;
   g2.matrix.translate(1, 0, 0);
   g2.render();

   var g3 = template;
   g3.matrix.translate(-2, 0, 0);
   g3.render();

   var g4 = template;
   g4.matrix.translate(0, -1, 0);
   g4.render();

   var g5 = template;
   g5.matrix.translate(-1, 0, 0);
   g5.render();

   var g6 = template;
   g6.matrix.translate(3, 0, 0);
   g6.render();

   var g7 = template;
   g7.matrix.translate(1, 0, 0);
   g7.render();

   var g8 = template;
   g8.matrix.translate(-2, 2, 0);
   g8.render();

   var g9 = template;
   g9.matrix.translate(-2, -3, 0);
   g9.render();

   var g10 = template;
   g10.matrix.translate(4, 0, 0);
   g10.render();
}
