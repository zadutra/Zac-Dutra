class Sphere{

    constructor(){
      this.type = 'sphere';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      //this.size = 5.0;
      //this.segment = 10.0;
      this.matrix = new Matrix4();
      this.textureNum = 2;
      this.verts32 = new Float32Array([]);
    }
  
    render(){
        var t;
        var r;
        var p1;
        var p2;
        var p3;
        var p4;
        var v;
        var uv;
        var d;
        var dd;
      //var xy = this.position;
      var rgba = this.color;
      //var segments = this.segment;
      
      //pass in texture number
      gl.uniform1i(u_whichTexture, this.textureNum);

      //pass the color to u_FragColor
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //pass the model matrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      d = Math.PI/10;
      dd = Math.PI/10;

      for(t = 0; t < Math.PI; t = t+d){
          for(r = 0; r<(2*Math.PI); r+=d){
              p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
              p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd)];
              p3 = [Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t)];
              p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];

              v =[];
              uv = [];
              v=v.concat(p1);
              uv=uv.concat([0,0]);
              v=v.concat(p2);
              uv=uv.concat([0,0]);
              v=v.concat(p4);
              uv=uv.concat([0,0]);

              gl.uniform4f(u_FragColor, 1,1,1,1);
              draw3DTriangleUVNormal(v,uv,v);

              v =[];
              uv = [];
              v=v.concat(p1);
              uv=uv.concat([0,0]);
              v=v.concat(p4);
              uv=uv.concat([0,0]);
              v=v.concat(p3);
              uv=uv.concat([0,0]);

              gl.uniform4f(u_FragColor, 1,1,1,1);
              draw3DTriangleUVNormal(v,uv,v);
          }
      }
    }
}