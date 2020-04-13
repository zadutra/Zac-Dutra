class Circle{
    constructor(){
      this.type = 'circle';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.segment = 10.0;
    }
  
    render(){
      var xy = this.position;
      var rgba = this.color;
      var segments = this.segment;
  
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
  
      var d = this.size/200.0

      let angleStep = 360/segments;
      for(var angle = 0; angle < 360; angle += angleStep){
          let centerPoint = [xy[0], xy[1]];
          let angle1 = angle;
          let angle2 = angle+angleStep;
          let vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
          let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
          let point1 = [centerPoint[0]+vec1[0], centerPoint[1]+vec1[1]];
          let point2 = [centerPoint[0]+vec2[0], centerPoint[1]+vec2[1]];

          drawTriangle( [xy[0], xy[1], point1[0], point1[1], point2[0], point2[1]] );
      }
    }
  }