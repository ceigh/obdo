// errors
const err = {
  throw: msg => { throw new Error(msg); },

  onlyIncrement: function(curr, prev, diff) {
    this.throw(`Only increment is allowed, but ${
      curr} - ${prev} = ${diff}`);
  },

  uselessTab: function() {
    this.throw('Remove unused last tab');
  },

  currSubZero: function(curr) {
    this.throw(`Tab number (${curr}) can't be less than zero`);
  },
};


export default (stringify = false, space, empty) => ({
  _depth: 0,
  _object: {},
  _inheritance: [],


  obj: function() {
    const object = this._object;
    return stringify ? JSON.stringify(object, null, space) : object;
  },


  key: function(name, depth = 0) {
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


  val: function(value = empty) {
    const inheritance = this._inheritance;
    const object = this._object;
    let tmp = value;

    for (let i = inheritance.length - 1; i > 0; --i) {
      const tmpObj = {};
      tmpObj[inheritance[i]] = tmp;
      tmp = tmpObj;
    }

    object[inheritance[0]] = typeof tmp === 'object'
      ? { ...object[inheritance[0]], ...tmp }
      : value;

    return this;
  },


  tab: function(quantity = 1) {
    const tabs = quantity;

    return {
      key: name => this.key(name, tabs),
      get obj() { err.uselessTab() },

      get o() { return this.obj },
      get k() { return this.key },
    };
  },


  // aliases
  get o() { return this.obj; },
  get k() { return this.key; },
  get v() { return this.val; },
  get _() { return this.tab; },
});
