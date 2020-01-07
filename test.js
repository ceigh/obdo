import o from './index.js';

console.log();

const example = o(true, '  ')
  .k('foo')
    ._().k('bar').v('baz')
    ._().k('qux')
    ._(2).k('qq').v('ee')
    ._(2).k('ee').v('qq')
  .k('asd').v('dsa')
  .o()

console.log('\n' + example);
