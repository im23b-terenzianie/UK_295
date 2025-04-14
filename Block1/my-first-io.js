const fs = require('fs');
const buffer = fs.readFileSync(process.argv[2]);
const str = buffer.toString();
const lines = str.split('\n').length - 1;
console.log(lines);

