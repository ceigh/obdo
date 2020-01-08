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


/* eslint-disable no-underscore-dangle */
export default (stringify = false, space, empty) => ({
  _depth: 0,
  _object: {},
  _inheritance: [],


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

    if (diff) this._depth = currDepth;
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

    return {
      key: (name) => this.key(name, depth),
      get obj() { return err.uselessTab(); },

      get o() { return this.obj; },
      get k() { return this.key; },
    };
  },


  // aliases
  get o() { return this.obj; },
  get k() { return this.key; },
  get v() { return this.val; },
  get _() { return this.tab; },
});
/* eslint-enable no-underscore-dangle */
