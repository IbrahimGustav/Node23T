//Operating System
const os = require('os')

console.log(`${os.hostname}`);
console.log(`${os.platform}`);

//File System
const fs = require('fs')
console.log(fs.readFileSync("data.txt", "utf-8"));