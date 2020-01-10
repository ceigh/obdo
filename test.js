/* eslint no-console: 0, newline-per-chained-call: 0, no-underscore-dangle: 0 */
/* global describe, test, expect */

import o from './index.js';


/*
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
*/

describe('scope tests', () => {
  test('only friendly keys', () => {
    expect(Object.keys(o()))
      .toEqual(['obj', 'key', 'val', 'tab']);
  });


  describe('not allow new props', () => {
    test('main', () => {
      expect(() => o().newProp = 'newValue').toThrow();
    });

    test('tab', () => {
      expect(() => o().tab().newProp = 'newValue').toThrow();
    });
  });


  describe('not allow write', () => {
    const tmp = o();

    describe('main', () => {
      Object.keys(tmp).forEach((k) => {
        test(k, () => {
          expect(() => tmp[k] = 'newValue').toThrow();
        });
      });
    });

    describe('aliases', () => {
      ['o', 'k', 'v', '_'].forEach((k) => {
        test(k, () => {
          expect(() => tmp[k] = 'newValue').toThrow();
        });
      });
    });

    describe('hidden', () => {
      ['_depth', '_object', '_inheritance'].forEach((k) => {
        test(k, () => {
          expect(() => tmp[k] = 'newValue').toThrow();
        });
      });
    });

    describe('tab', () => {
      ['o', 'obj', 'k', 'key'].forEach((k) => {
        test(k, () => {
          expect(() => tmp.tab()[k] = 'newValue').toThrow();
        });
      });
    });
  });


  describe('not allow configure', () => {
    const tmp = o();

    describe('main', () => {
      Object.keys(tmp).forEach((k) => {
        test(k, () => {
          expect(() => Object.defineProperty(tmp, k, { writable: true }))
            .toThrow();
        });
      });
    });

    describe('aliases', () => {
      ['o', 'k', 'v', '_'].forEach((k) => {
        test(k, () => {
          expect(() => Object.defineProperty(tmp, k, { writable: true }))
            .toThrow();
        });
      });
    });

    describe('hidden', () => {
      ['_object', '_inheritance'].forEach((k) => { // not _depth
        test(k, () => {
          expect(() => Object.defineProperty(tmp, k, { writable: true }))
            .toThrow();
        });
      });
    });

    describe('tab', () => {
      ['o', 'obj', 'k', 'key'].forEach((k) => {
        test(k, () => {
          expect(() => Object.defineProperty(tmp.tab(), k, { writable: true }))
            .toThrow();
        });
      });
    });
  });
});
