var canvas = document.getElementById('example');
var ctx = canvas.getContext('2d');
function main() {
     // Retrieve <canvas> element <- (1)
     if (!canvas) {
     console.log('Failed to retrieve the <canvas> element');
     return;
     }
     // Get the rendering context for 2DCG <- (2)
     ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
     ctx.fillRect(0,0, canvas.width, canvas.height);
    }

function drawVector(v, color){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(canvas.height/2,canvas.width/2);
    ctx.lineTo(200+v.elements[0]*20, 200-v.elements[1]*20);
    ctx.stroke();
}

function handleDrawEvent(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = 'black'; // Set a black color
    ctx.fillRect(0,0, canvas.width, canvas.height);
    //vector1
    var x1Value = document.getElementById('X1').value;
    var y1Value = document.getElementById('Y1').value;
    var v1 = new Vector3([x1Value,y1Value,0]);
    //vector2
    var x2Value = document.getElementById('X2').value;
    var y2Value = document.getElementById('Y2').value;
    var v2 = new Vector3([x2Value,y2Value,0]);
    //draw
    drawVector(v1,"red");
    drawVector(v2, "blue");
}

function handleDrawOperationEvent(){
    //clear canvas
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = 'black'; // Set a black color
    ctx.fillRect(0,0, canvas.width, canvas.height);
    //vector1
    var x1Value = document.getElementById('X1').value;
    var y1Value = document.getElementById('Y1').value;
    var v1 = new Vector3([x1Value,y1Value,0]);
    drawVector(v1,"red");
    //vector2
    var x2Value = document.getElementById('X2').value;
    var y2Value = document.getElementById('Y2').value;
    var v2 = new Vector3([x2Value,y2Value,0]);
    drawVector(v2, "blue");
    //vector3
    var v3 = new Vector3([0,0,0]);
    //vector4
    var v4 = new Vector3([0,0,0]);
    //scalar and select
    var Scalar = document.getElementById('Scalar').value;
    var select = document.getElementById('Functions').value;
    //check which selection is made
    if(select.localeCompare("Add") == 0){ //add
        v3.add(v1,v2);
        drawVector(v3, "green");
    }
    else if(select.localeCompare("Subtract") == 0){ //subtract
        v3.sub(v1,v2);
        drawVector(v3, "green");
    }
    else if(select.localeCompare("Multiply") == 0){ //multiply
        v3.mul(v1, Scalar);
        v4.mul(v2, Scalar);
        drawVector(v3, "green");
        drawVector(v4, "green");
    }
    else if(select.localeCompare("Divide") == 0){ //divide
        v3.div(v1, Scalar);
        v4.div(v2, Scalar);
        drawVector(v3, "green");
        drawVector(v4, "green");
    }
    else if(select.localeCompare("Magnitude") == 0){ //Magnitude
        var m1 = v1.magnitude();
        console.log("Magnitude v1:", m1);
        var m2 = v2.magnitude();
        console.log("Magnitude v2:", m2);
    }
    else if(select.localeCompare("Normalize") == 0){ //Normalize
        v3.normalize(v1);
        drawVector(v3, "green");
        v4.normalize(v2);
        drawVector(v4, "green");
    }
    else if(select.localeCompare("Angle Between") == 0){ //Angle Between
        var angle = angleBetween(v1,v2);
        console.log("Angle:", angle);
    }
    else if(select.localeCompare("Area") == 0){ //area
        var area = areaTriangle(v1,v2);
        console.log("Area of the triangle:", area);
    }
}

function angleBetween(v1,v2){
    var d = Vector3.dot(v1,v2);
    var m1 = v1.magnitude();
    var m2 = v2.magnitude();
    var result = (Math.acos(d/(m1*m2)))*(180/Math.PI);
    return result;
}

function areaTriangle(v1,v2){
    var v3 = Vector3.cross(v1,v2);
    var area = (v3.magnitude())/2;
    return area;
}