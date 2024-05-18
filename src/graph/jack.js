// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ ``

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div class="x-jack">
    This is a jack with ID: {{ id }}
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const makeKey = require("@jrc03c/make-key")

module.exports = createVueComponentWithCSS({
  name: "x-jack",
  template,

  props: {
    id: {
      type: String,
      false: true,
      default: () => makeKey(8),
    },
  },

  data() {
    return {
      css,
    }
  },
})
