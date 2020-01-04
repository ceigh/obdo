export default {
  _de: [0, 0], // depth: [old, new]
  _st: [],     // parents stack
  obj: {},     // result


  _to: function(k1, k2, val = {}, obj = this.obj) {
    Object.keys(obj).some(k => {
      if (k === k1) obj[k][k2] = val;
      else if (obj[k] && typeof obj[k] === 'object')
        this._to(k1, k2, val, obj[k]);
    });
  },


  tab: function(tabs = 1) {
    this._de = [this._de[1], tabs];
    return this;
  },


  key: function(name) {
    const de = this._de;
    const st = this._st;
    const ff = de[1] - de[0];
    
    if (!ff) {

      if (!de[0]) this.obj[name] = {};

      else this._to(st[de[0] - 1], name);

      this._st[de[0]] = name;
    
    } else {

      if (ff > 0) this._to(st[st.length - 1], name);

      else {
        for (let i = 0; i < -ff + 1; ++i) this._st.pop();
        this._to(st[st.length - 1], name);
        this.tab(0);
      }
      if (!de[1]) this.obj[name] = {};
      this._st.push(name);
    }

    console.log(this._st, de);
    return this;
  },


  val: function(data) {
    const st = this._st;
    const len = st.length;

    if (len > 1) this._to(st[len - 2], st[len - 1], data);
    else this._to('obj', st[0], data, this);

    return this;
  },


  // aliases
  get _() { return this.tab },
  get k() { return this.key },
  get v() { return this.val },
  get o() { return this.obj },
};
