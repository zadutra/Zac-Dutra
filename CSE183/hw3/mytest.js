const Templater = require("./templater");

const t = new Templater('Mary {{had}} a {{lamb}} {{lamb}}');
t.apply({had: 'had', lamb: 'lamb'});
console.log(this.temp);