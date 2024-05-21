// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-node {
    width: 192px;
    border: 1px solid black;
    background-color: rgb(235, 235, 235);
  }

  .x-node-title-bar {
    padding: 0.5em;
    background-color: rgb(215, 215, 215);
    border-bottom: 1px solid black;
  }

  .x-node-body {
    padding: 0.5em;
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
    <div class="x-node-title-bar">
      <div class="x-node-title">
        {{ title }}
      </div>
    </div>

    <div class="x-node-body">
      This is a node!
      <slot></slot>
    </div>

    <div class="x-node-jacks">
      <x-jack
        :id="jack.id"
        :key="jack.id"
        :title="jack.title"
        :type="jack.type"
        v-for="jack in jacks">
      </x-jack>
    </div>
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

    title: {
      type: String,
      required: false,
      default: () => "Node",
    },
  },

  data() {
    return {
      css,
    }
  },
})
