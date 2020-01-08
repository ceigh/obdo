/* eslint no-console: 0, newline-per-chained-call: 0 */

import o from './index.js';


console.log(
  o(true, '  ', null)
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
