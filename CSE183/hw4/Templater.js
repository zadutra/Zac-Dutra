/**
 * CSE183 Assignment 4 - Basic
 */
class Templater {
  /**
   * Replace the contents of {{ }} tagged table header and data 
   * elements in document with values found in the supplied JSON
   * @param {object} document 
   * @param {string} json with propeties matching tags in document
   */
  byTag(document, json) {
    let temp = json;
    this.result = temp.split(",");
    this.keys = [];
    this.values = [];
    for(var i of this.result){
      i = i.replace(/[""]/g, "");
      i = i.replace(/[{}]/g, "");
      i = i.replace(/[\n]/g, "");
      let j = i.split(":");
      j[0] = j[0].replace(/[" "]/g, "");
      this.keys.push(j[0]);
      this.values.push(j[1]);
      }
    var header = document.getElementsByTagName("th");
    var rows = document.getElementsByTagName("td");
    var i = 0;
    for(var x = 0; x < 15; x++){
      if(x < 3){
        if(header[x].innerHTML.includes(this.keys[i])){
          console.log("check");
          header[x].innerHTML = this.values[i];
          i++;
          x = 0;
        }
      }
      if(rows[x].innerHTML.includes(this.keys[i])){
        rows[x].innerHTML = this.values[i];
        i++;
        x = 0;
      }
    }
    for(var x = 0; x < 15; x++){
      if(x < 3){
        if(header[x].innerHTML.includes("{{")){
          header[x].innerHTML = "";
        }
      }
      if(rows[x].innerHTML.includes("{{")){
        rows[x].innerHTML = "";
      }
    }
  }

  /**
   * Replace the contents of table header and data elements in
   * in document with id'd content found in the supplied JSON
   * @param {object} document 
   * @param {string} json with propeties matching element ids in document
   */
  byId(document, json) {
    let temp = json;
    this.result = temp.split(",");
    this.keys = [];
    this.values = [];
    let ids = document.querySelectorAll('[id]'); //got from stack overflow
    var idArr = Array.prototype.slice.call(ids); //got from stack overflow
    idArr.length = 18;
    for(var i of this.result){
      i = i.replace(/[""]/g, "");
      i = i.replace(/[{}]/g, "");
      i = i.replace(/[\n]/g, "");
      let j = i.split(":");
      j[0] = j[0].replace(/[" "]/g, "");
      this.keys.push(j[0]);
      this.values.push(j[1]);
      }
    for(var i of idArr){
      if(this.keys.includes(i.id)){
        var x = this.keys.indexOf(i.id)
        document.getElementById(i.id).innerHTML = this.values[x];
      }
      else{
        document.getElementById(i.id).innerHTML = "";
      }
    }
  }
}
