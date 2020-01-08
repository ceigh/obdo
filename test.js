/* eslint no-console: 0, newline-per-chained-call: 0, no-underscore-dangle: 0 */

import o from './index.js';


console.log(
  o(true, 2)
    .k('a')
    ._().k('a1').v('_a1')
    ._().k('a2')
    ._(2).k('a3')
    ._(3).k('a4').v('_a4')
    ._().k('a5').v('_a5')
    ._().k('a6')
    ._(2).k('a7').v('_a7')
    .k('b').v('_b')
    .o(),
);


const a = o();
console.log(Object.keys(a));

// must fail
// a.b = 3;
// a.tab = 2;
// Object.defineProperty(a, 'tab', { writable: true })
// a._ = 3;
// a._depth = 4;
// a._inheritance = 4;
// Object.defineProperty(a, '_inheritance', { writable: true });

// must pass
// Object.defineProperty(a, '_depth', { writable: true });
// a._depth = 5;

const t = a._();
console.log(Object.keys(t));

// must fail
// t.ccc = 2;
// t.key = 'asd';
// t.o = 4;
// Object.defineProperty(t, 'o', { value: 4 });
