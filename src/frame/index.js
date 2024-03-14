// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ ``

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <x-frame-horizontal
    :is-locked="isLocked"
    :max-width="maxSize"
    :min-width="minSize"
    @resize="$emit('resize', $event)"
    @resize-end="$emit('resize-end', $event)"
    @resize-start="$emit('resize-start', $event)"
    v-if="orientation === 'horizontal'">
    <slot></slot>
  </x-frame-horizontal>

  <x-frame-vertical
    :is-locked="isLocked"
    :max-height="maxSize"
    :min-height="minSize"
    @resize="$emit('resize', $event)"
    @resize-end="$emit('resize-end', $event)"
    @resize-start="$emit('resize-start', $event)"
    v-if="orientation === 'vertical'">
    <slot></slot>
  </x-frame-vertical>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const HorizontalFrameComponent = require("./horizontal")
const VerticalFrameComponent = require("./vertical")

module.exports = createVueComponentWithCSS({
  name: "x-frame",
  template,
  emits: ["resize", "resize-end", "resize-start"],

  components: {
    "x-frame-horizontal": HorizontalFrameComponent,
    "x-frame-vertical": VerticalFrameComponent,
  },

  props: {
    "is-locked": {
      type: Boolean,
      required: false,
      default: () => false,
    },

    "max-size": {
      type: Number,
      required: false,
      default: () => Infinity,
    },

    "min-size": {
      type: Number,
      required: false,
      default: () => 64,
    },

    orientation: {
      type: String,
      required: false,
      default: () => "horizontal",
    },
  },

  data() {
    return {
      css,
    }
  },
})
