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


export default (string = false, space, empty) => ({
  _de:  0,                                   // depth
  _st: [],                                   // stack
  _fi: {},                                   // final
  _pr: { st: string, sp: space, em: empty }, // props


  obj: function(string = this._pr.st, space = this._pr.sp) {
    const final = this._fi;
    return string
      ? JSON.stringify(final, null, space)
      : final;
  },


  key: function(name, tabs = 0) {
    const st = this._st;
    const prev = this._de;
    const curr = tabs;
    const diff = curr - prev;

    // checks
    if (curr < 0) err.subZero(curr);
    if (diff > 1) err.increment(curr, prev, diff);

    st.length = curr + 1;
    st[curr] = name;
    this.val();

    if (diff) this._de = curr;
    console.log([prev, curr], st);
    return this;
  },


  val: function(data = this._pr.em) {
    const st = [...this._st];
    const first = st.shift();
    let value = data;

    while (st.length) {
      const obj = {};
      obj[st.pop()] = value;
      value = obj;
    }

    this._fi[first] = value;
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
