// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ ``

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div class="x-edge">
    This is an edge with ID: {{ edge.id }}
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const makeKey = require("@jrc03c/make-key")

class EdgeClass {
  id = null

  constructor(data) {
    data = data || {}
    this.id = data.id || makeKey(8)
  }
}

const component = createVueComponentWithCSS({
  name: "x-edge",
  template,

  props: {
    edge: {
      type: EdgeClass,
      required: true,
      default: () => null,
    },
  },

  data() {
    return {
      css,
    }
  },
})

module.exports = { class: EdgeClass, component }