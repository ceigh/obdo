import o from './index.js';

console.log();

const example = o(true, '  ')
  .k('foo')
    ._().k('bar').v('baz')
    ._().k('qux').v('quux')
  .o()

console.log('\n' + example);
