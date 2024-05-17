// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ ``

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div class="x-jack">
    This is a jack with ID: {{ jack.id }}
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const makeKey = require("@jrc03c/make-key")

class JackClass {
  id = null

  constructor(data) {
    data = data || {}
    this.id = data.id || makeKey(8)
  }
}

const component = createVueComponentWithCSS({
  name: "x-jack",
  template,

  props: {
    jack: {
      type: JackClass,
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

module.exports = { class: JackClass, component }
