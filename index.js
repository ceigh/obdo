// errors
const err = {
  throw: msg => { throw new Error(msg); },

  inc: function(curr, prev, diff) {
    this.throw(`Only increment is allowed, but ${
      curr} - ${prev} = ${diff}`);
  },

  tab: function() {
    this.throw('Remove unused last tab');
  },
};


export default () => ({
  _de:  0, // depth
  _st: [], // stack
  obj: {}, // final


  key: function(name, tabs = 0) {
    const prev = this._de;
    const curr = tabs;
    const diff = curr - prev;

    if (curr > prev && diff !== 1)
      err.inc(curr, prev, diff);

    this._st.length = curr + 1;
    this._st[curr] = name;

    this._de = curr;
    console.log([prev, curr], this._st);
    return this;
  },


  val: function(data) {
    return this;
  },


  tab: function(tabs = 1) {
    return {
      key: name => this.key(name, tabs),
      get obj() { err.tab() },

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
