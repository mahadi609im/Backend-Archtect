// import a from './file1.mjs';
// console.log(a);

// import { x } from './file1.mjs'; //object er moto kore import korte hobe
// import { y as b } from './file1.mjs';
// console.log(x, b);

import { x, y } from './file1.mjs';
import addFunc from './utils/add.mjs';

console.log(addFunc(x, y));
