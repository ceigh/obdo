export default {
  _st: [],
  obj: {},


  tab: (tabs = 1) => {},

  key: (name) => {},

  val: (data) => {},


  get _() { return this.tab },
  get k() { return this.key },
  get v() { return this.val },
  get o() { return this.obj }
}
