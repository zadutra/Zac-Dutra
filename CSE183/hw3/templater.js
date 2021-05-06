/**
 * CSE183 Assignment 3 - Basic
 */
class Templater {
  /**
   * Create a templater
   * @param {string} template - A {{ }} tagged string
   */
  constructor(template) {
    this.template = template;
    this.temp =  template;
    this.tags = [];
    this.invalid = [];
    if(template != undefined){
      this.result = this.temp.split(" ");
      for(var i of this.result){
        if((i.includes("{{") && !i.includes('}}')) || (!i.includes("{{") && i.includes('}}')) ){
            i = i.replace(/[{}]/g, "");
            this.invalid.push(i);
            continue;
          }
        if(i.includes("{{") && i.includes('}}')){
            i = i.replace(/[{}]/g, "");
            this.tags.push(i);
          }
        }
        this.temp = this.temp.replace(/[{}]/g, ""); //I got this from Stack overflow
      }
   }

  /**
   * Apply map to template to generate string
   * @param {object} map Object with propeties matching tags in template
   * @param {boolean} strict Throw an Error if any tags in template are
   *     not found in map
   * @return {string} template with all tags replaced
   * @throws An Error if strict is set and any tags in template are not
   *     found in map
   */
  apply(map, strict) {
    let count = 0;
    let check = false;
    console.log(this.tags);
    if(this.template != undefined){
       for(var i of Object.keys(map)){
            this.temp = this.temp.replace(i, Object.values(map)[count]);
            count += 1;
            let index = this.tags.indexOf(i);
            this.tags.splice(index, 1);
          }
       if(this.tags.length > 0){
         check = true;
       }
       for(var i of this.tags){
            this.temp = this.temp.replace(i, "");
            let index = this.tags.indexOf(i);
            this.tags.splice(index, 1);
          }
        if(strict == true && check == true){
          throw(Error);
        }
        for(var i of this.invalid){
          this.temp = this.temp.replace(i, "");
        }
       this.temp = this.temp.replace(/\s+/g,' '); //got this from stack overflow
       console.log(this.temp);
       return this.temp;
    }
  }
}
module.exports = Templater;