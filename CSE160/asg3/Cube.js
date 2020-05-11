class Cube{

    constructor(){
      this.type = 'cube';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      //this.size = 5.0;
      //this.segment = 10.0;
      this.matrix = new Matrix4();
    }
  
    render(){
      //var xy = this.position;
      var rgba = this.color;
      //var segments = this.segment;
      
      //pass the color to u_FragColor
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //pass the model matrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      
      // Top of cube
      draw3DTriangle([1.0, 1.0, 0.0,  1.0, 1.0, 1.0,  0.0, 1.0, 1.0 ]);
      draw3DTriangle([1.0, 1.0, 0.0,  0.0, 1.0, 1.0,  0.0, 1.0, 0.0 ]);
      
      //left of cube
      draw3DTriangle([0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  0.0, 0.0, 1.0 ]);
      draw3DTriangle([0.0, 1.0, 0.0,  0.0, 0.0, 1.0,  0.0, 0.0, 0.0 ]);

      //bottom of cube
      draw3DTriangle([0.0, 0.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0, 0.0 ]);
      draw3DTriangle([0.0, 0.0, 1.0,  1.0, 0.0, 0.0,  0.0, 0.0, 0.0 ]);

      //front of cube
      draw3DTriangle([1.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 0.0 ]);
      draw3DTriangle([1.0, 1.0, 0.0,  0.0, 0.0, 0.0,  1.0, 0.0, 0.0 ]);

      //back of cube
      draw3DTriangle([1.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 1.0, 1.0 ]);
      draw3DTriangle([1.0, 0.0, 1.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0 ]);
      
      //pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

      //right of cube
      draw3DTriangle([1.0, 1.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 1.0 ]);
      draw3DTriangle([1.0, 1.0, 0.0,  1.0, 0.0, 1.0,  1.0, 1.0, 1.0 ]);

      }
}
