// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ ``

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div class="x-edge">
    This is an edge with ID: {{ id }}
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const makeKey = require("@jrc03c/make-key")

module.exports = createVueComponentWithCSS({
  name: "x-edge",
  template,

  props: {
    id: {
      type: String,
      required: false,
      default: () => makeKey(8),
    },

    "input-jack": {
      type: Object,
      required: true,
      default: () => null,
    },

    "output-jack": {
      type: Object,
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
