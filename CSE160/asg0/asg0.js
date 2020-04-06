function main() {
     // Retrieve <canvas> element <- (1)
     var canvas = document.getElementById('example');
     if (!canvas) {
     console.log('Failed to retrieve the <canvas> element');
     return;
     }
    
     // Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');
     // Draw a blue rectangle <- (3)
     ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
     ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
    let v1 = new Vector3([2.25,2.25,0]);
    drawVector(v1, "red");
    }

function drawVector(v, color){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(canvas.height/2,canvas.width/2);
    ctx.lineTo(200+v.elements[0]*20, 200-v.elements[1]*20);
    ctx.stroke();
}