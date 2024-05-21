// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-node {
    width: 128px;
    padding: 1em;
    border: 1px solid black;
    background-color: rgb(235, 235, 235);
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <x-draggable
    :is-h-locked="isHLocked"
    :is-v-locked="isVLocked"
    :x="x"
    :y="y"
    @drag-end="$emit('drag-end', $event)"
    @drag-start="$emit('drag-start', $event)"
    @drag="$emit('drag', $event)"
    class="x-node">
    This is a node with ID: {{ id }}
    <x-jack :id="jack.id" :key="jack.id" v-for="jack in jacks"></x-jack>
  </x-draggable>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const DraggableComponent = require("../draggable")
const JackComponent = require("./jack")
const makeKey = require("@jrc03c/make-key")

module.exports = createVueComponentWithCSS({
  name: "x-node",
  template,
  emits: [...DraggableComponent.emits],

  components: {
    "x-draggable": DraggableComponent,
    "x-jack": JackComponent,
  },

  props: {
    ...DraggableComponent.props,

    id: {
      type: String,
      required: false,
      default: () => makeKey(8),
    },

    jacks: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      css,
    }
  },
})
