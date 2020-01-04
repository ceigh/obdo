// errors
const err = {
  throw: msg => { throw new Error(msg); },

  increment: function(curr, prev, diff) {
    this.throw(`Only increment is allowed, but ${
      curr} - ${prev} = ${diff}`);
  },

  uselessTab: function() {
    this.throw('Remove unused last tab');
  },

  subZero: function(curr) {
    this.throw(`Tab number (${curr}) can't be less than zero`);
  },
};


export default (string = false, space) => ({
  _de:  0,                        // depth
  _st: [],                        // stack
  _fi: {},                        // final
  _pr: { st: string, sp: space }, // props


  obj: function(string = this._pr.st, space = this._pr.sp) {
    const final = this._fi;
    return string
      ? JSON.stringify(final, null, space)
      : final;
  },


  key: function(name, tabs = 0) {
    const prev = this._de;
    const curr = tabs;
    const diff = curr - prev;

    // checks
    if (curr < 0) err.subZero(curr);
    if (diff > 1) err.increment(curr, prev, diff);

    this._st.length = curr + 1;
    this._st[curr] = name;

    if (diff) this._de = curr;
    console.log([prev, curr], this._st);
    return this;
  },


  val: function(data) {
    return this;
  },


  tab: function(tabs = 1) {
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
