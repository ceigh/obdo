/* eslint no-console: 0, newline-per-chained-call: 0, no-underscore-dangle: 0 */
/* global describe, test, expect */

import o from './index.js';


describe('functionality tests', () => {
  describe('creates', () => {
    test('empty', () => {
      expect(o().o()).toEqual({});
    });

    test('one', () => {
      expect(o().k('a').v('_a').o())
        .toEqual({ a: '_a' });
    });

    test('multi', () => {
      expect(o().k('a').v('_a').k('b').v('_b').o())
        .toEqual({ a: '_a', b: '_b' });
    });

    test('one nested', () => {
      expect(o().k('a')._().k('a2').v('_a2').o())
        .toEqual({ a: { a2: '_a2' } });
    });

    test('multi nested', () => {
      expect(o()
        .k('a')
        ._().k('a2').v('_a2')
        .k('b')
        ._().k('b2').v('_b2')
        .o()
      ).toEqual({
        a: {
          a2: '_a2',
        },
        b: {
          b2: '_b2',
        },
      });
    });

    test('multi one nested', () => {
      expect(o()
        .k('a')
        ._().k('a2')
        ._(2).k('a3').v('_a3')
        .o()
      ).toEqual({
        a: {
          a2: {
            a3: '_a3',
          },
        },
      });
    });

    test('multi multi nested', () => {
      expect(o()
        .k('a')
        ._().k('a2')
        ._(2).k('a3').v('_a3')
        .k('b')
        ._().k('b2')
        ._(2).k('b3').v('_b3')
        .o()
      ).toEqual({
        a: {
          a2: {
            a3: '_a3',
          },
        },
        b: {
          b2: {
            b3: '_b3',
          },
        },
      });
    });

    test("don't rewrite", () => {
      expect(o()
        .k('a')
        ._().k('a2').v('_a2')
        ._().k('a3').v('_a3')
        .o()
      ).toEqual({
        a: {
          a2: '_a2',
          a3: '_a3',
        },
      });
    });

    test('nesting with return', () => {
      expect(o()
        .k('a')
        ._().k('a2')
        ._(2).k('a3').v('_a3')
        ._().k('a4').v('_a4')
        .o()
      ).toEqual({
        a: {
          a2: {
            a3: '_a3',
          },
          a4: '_a4',
        },
      });
    });
  });


  describe('throws', () => {
    test('uselessTab', () => {
      expect(() => o()._().o()).toThrow();
    });

    test('currSubZero', () => {
      expect(() => o().k('a')._(-1).k('a2').v('_a2').o()).toThrow();
    });

    test('onlyIncrement', () => {
      expect(() => o().k('a')._(2).k('a2').v('_a2').o()).toThrow();
    });
  });


  describe('params', () => {
    test('stringify', () => {
      expect(o(true).k('a').v('_a').o()).toBe("{\"a\":\"_a\"}");
    });
    
    test('stringify with space', () => {
      expect(o(true, ' ').k('a').v('_a').o())
        .toBe("{\n \"a\": \"_a\"\n}");
    });
    
    test('stringify with space (simple)', () => {
      expect(o(true, 1).k('a').v('_a').o())
        .toBe("{\n \"a\": \"_a\"\n}");
    });

    test('empty placeholder', () => {
      expect(o(false, '', 0).k('a').o()).toEqual({ a: 0 });
    });

    test('tab before key', () => {
      expect(o()._().k('a').v('_a').o())
        .toEqual({ undefined: { a: '_a' } });
    });

    describe('.val()', () => {
      test('not provided', () => {
        expect(o().k('a').o()).toEqual({ a: undefined });
      });

      test('falsy', () => {
        expect(o().k('a').v(undefined).o()).toEqual({ a: undefined });
        expect(o().k('a').v(null).o()).toEqual({ a: null });
      });
    });
  });
});


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
