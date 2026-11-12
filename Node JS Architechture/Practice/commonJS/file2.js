// const output = require('./file1.js')
// console.log(output);

// const output = require('./file1.js');
// const { x, y } = require('./file1.js');

// console.log(output);
// console.log(x, y);

const { a: x, b: y } = require('./file1.js');
const addFunc = require('./utils/add.js');
console.log(addFunc(x, y));

// const { num1, num2 } = require('./file1.js');
// const addFunc = require('./utils/add.js');
// console.log(addFunc(num1, num2));
