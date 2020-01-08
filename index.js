const err = {
  onlyIncrement(curr, prev, diff) {
    this.throw(`Only increment is allowed, but ${
      curr} - ${prev} = ${diff}`);
  },

  uselessTab() {
    this.throw('Remove unused last tab');
  },

  currSubZero(curr) {
    this.throw(`Tab number (${curr}) can't be less than zero`);
  },
};

Object.defineProperty(err, 'throw', {
  value: (msg) => { throw new Error(msg); },
});
Object.freeze(err);


/* eslint-disable no-underscore-dangle */
export default (stringify = false, space, empty) => {
  const obdo = {
    obj() {
      const object = this._object;
      return stringify
        ? JSON.stringify(object, null, space)
        : object;
    },


    key(name, depth = 0) {
      const inheritance = this._inheritance;
      const prevDepth = this._depth;
      const currDepth = depth;
      const diff = currDepth - prevDepth;

      // checks
      if (currDepth < 0) err.currSubZero(currDepth);
      if (diff > 1) err.onlyIncrement(currDepth, prevDepth, diff);

      inheritance.length = currDepth + 1;
      inheritance[currDepth] = name;
      this.val(); // set empty

      if (diff) {
        Object.defineProperty(this, '_depth', {
          value: currDepth,
          // to prevent direct edit, but save functionality
          configurable: true,
        });
      }
      return this;
    },


    val(value = empty) {
      const inheritance = this._inheritance;
      const object = this._object;
      let tmp = value;

      for (let i = inheritance.length - 1; i > 0; i -= 1) {
        const tmpObj = {};
        tmpObj[inheritance[i]] = tmp;
        tmp = tmpObj;
      }

      object[inheritance[0]] = typeof tmp === 'object'
        ? { ...object[inheritance[0]], ...tmp }
        : value;

      return this;
    },


    tab(quantity = 1) {
      const depth = quantity;
      const tab = {
        key: (name) => this.key(name, depth),
      };

      Object.defineProperties(tab, {
        // alias
        k: { get() { return this.key; } },
        // prevent .tab().obj()
        obj: { get() { return err.uselessTab(); } },
        o: { get() { return this.obj; } },
      });

      Object.freeze(tab);

      return tab;
    },
  };

  Object.defineProperties(obdo, {
    // to prevent direct edit, but save functionality
    _depth: { value: 0, configurable: true },
    _object: { value: {} },
    _inheritance: { value: [] },

    // do this because we can't use Object.freeze()
    key: { writable: false, configurable: false },
    val: { writable: false, configurable: false },
    tab: { writable: false, configurable: false },

    // aliases
    o: { get() { return this.obj; } },
    k: { get() { return this.key; } },
    v: { get() { return this.val; } },
    _: { get() { return this.tab; } },
  });

  Object.preventExtensions(obdo);

  return obdo;
};
/* eslint-enable no-underscore-dangle */
