const err = {
  throw: (msg) => { throw new Error(msg); },

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

Object.freeze(err);


/* eslint-disable no-underscore-dangle */

/**
 * Main obdo function,
 * use as initial setup and get tmp object to tweak
 *
 * @param {boolean} [stringify=false] - Use JSON.stringify
 * @param {*} [space] - Stringify separator
 * @param {*} [empty] - Default value for empty keys
 *
 * @return {Object} Tmp object to fill
 */
export default (stringify = false, space, empty) => {
  const obdo = {
    /**
     * Last chain method, must always be called
     *
     * @return {Object|string} Result JSON
     */
    obj() {
      const object = this._object;
      return stringify
        ? JSON.stringify(object, null, space)
        : object;
    },


    /**
     * Add key to virtual inheritance stack of object
     *
     * @param {*} name - Key name
     * @param {number} [depth=0] - At what depth should the key be placed
     *
     * @return {Object} Self object to support chaining
     */
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


    /**
     * Assign value to last key in inheritance stack
     *
     * @param {*} [value=empty] - Value to assign, default is empty from setup
     *
     * @return {Object} Self object to support chaining
     */
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


    /**
     * Pass depth to .key() call
     *
     * @param {number} [quantity=1] - Depth to pass
     *
     * @return {Object} Pseudo self object to curry .key() method in chain
     */
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
    obj: { writable: false, configurable: false },
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
