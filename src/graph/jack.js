// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-jack {
    position: relative;
    width: 100%;
  }

  .x-jack .x-jack-hole {
    display: none;
    width: 1em;
    height: 1em;
    box-sizing: border-box;
    border-radius: 100%;
    position: absolute;
    top: calc(50% - 0.5em);
    left: -0.5em;
    background-color: blue;
    cursor: pointer !important;
  }

  .x-jack .x-jack-hole:hover {
    background-color: hsl(225deg, 100%, 75%);
  }

  .x-jack.x-input-jack .x-jack-hole {
    display: block;
  }

  .x-jack.x-output-jack .x-jack-hole {
    display: block;
    left: unset;
    right: -0.5em;
  }

  .x-jack .x-jack-title {
    padding: 0.5em;
    text-align: center;
  }

  .x-jack.x-input-jack .x-jack-title {
    text-align: left;
    padding-left: 1em;
  }

  .x-jack.x-output-jack .x-jack-title {
    text-align: right;
    padding-right: 1em;
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div
    :class="{
      'x-input-jack': type === 'input',
      'x-output-jack': type === 'output'
    }"
    class="x-jack">
    <div class="x-jack-hole"></div>

    <div class="x-jack-title">
      {{ title }}
    </div>
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
  emits: ["connect", "disconnect"],

  props: {
    id: {
      type: String,
      false: false,
      default: () => makeKey(8),
    },

    title: {
      type: String,
      required: true,
      default: () => "input jack",
    },

    type: {
      type: String,
      required: true,
      default: () => "input", // or "output"
    },
  },

  data() {
    return {
      css,
    }
  },
})
