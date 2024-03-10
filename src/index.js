const MiscVueComponents = {
  Draggable: require("./draggable"),
  Frame: require("./frame"),
  Resizeable: require("./resizeable"),
}

if (typeof module !== "undefined") {
  module.exports = MiscVueComponents
}

if (typeof window !== "undefined") {
  window.MiscVueComponents = MiscVueComponents
}
