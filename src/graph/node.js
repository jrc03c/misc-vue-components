// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ ``

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <x-draggable :x="node.x" :y="node.y" class="x-node">
    This is a node with ID: {{ node.id }}

    <x-jack :jack="jack" :key="jack.id" v-for="jack in node.jacks"></x-jack>
  </x-draggable>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const DraggableComponent = require("../draggable")
const Jack = require("./jack")
const makeKey = require("@jrc03c/make-key")

class NodeClass {
  id = null
  jacks = []
  x = 0
  y = 0

  constructor(data) {
    data = data || {}
    this.id = data.id || makeKey(8)
    this.jacks = data.jacks ? data.jacks.map(j => new Jack.class(j)) : []
    this.x = data.x || 0
    this.y = data.y || 0
  }
}

const component = createVueComponentWithCSS({
  name: "x-node",
  template,

  components: {
    "x-draggable": DraggableComponent,
    "x-jack": Jack.component,
  },

  props: {
    node: {
      type: NodeClass,
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

module.exports = { class: NodeClass, component, Jack }
